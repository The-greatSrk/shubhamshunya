import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { GoogleGenAI } from '@google/genai';

// Retrieval-augmented "Shunya companion". Answers are generated only from the text in
// knowledge/shunya/, every claim carries a citation, and quotes are verified against the source.

const KNOWLEDGE_DIR = path.resolve(process.cwd(), 'knowledge');
const CACHE_FILE = path.resolve(process.cwd(), '.rag-cache', 'index.json');

const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001';
const ANSWER_MODEL = process.env.GEMINI_COMPANION_MODEL || 'gemini-3.8-flash';
const FALLBACK_MODEL = process.env.GEMINI_COMPANION_FALLBACK_MODEL || 'gemini-3.1-flash-lite';
const MODEL_TIMEOUT_MS = 12000;
const MODEL_TIMEOUT_SOLO_MS = 25000;
const MODEL_HEDGE_MS = 4000;
const MODEL_COOLDOWN_MS = 5 * 60 * 1000;
const modelDownUntil = new Map<string, number>();
const BOOK_SOURCE = /^(अध्याय|प्रस्तावना|उपसंहार)/;
const BOOK_BOOST = Number(process.env.RAG_BOOK_BOOST || 1.25);
// 5 cut off multi-part answers ("the five stages of ...") when the list spans two chunks; 7 keeps them whole.
const TOP_K = Number(process.env.RAG_TOP_K || 7);
const CHUNK_CHARS = 900;
// Measured with gemini-embedding-001 against the Hindi book: in-book questions (English or Hindi) score
// 0.68-0.73 at best, unrelated ones 0.54-0.58. 0.62 sits in the gap.
const MIN_VECTOR_SCORE = Number(process.env.RAG_MIN_VECTOR_SCORE || 0.62);

export const NOT_IN_BOOK_REPLY =
  "I don't have that in my knowledge base, and I'd rather say so than guess. " +
  'I can help with the ideas in *Shunya: Sat Chit Anand*, Codagram (tracks, fees, admissions), and Shubham Kasar.';

export interface Chunk {
  id: string;
  source: string;
  text: string;
  embedding?: number[];
}

export interface Citation {
  n: number;
  source: string;
  excerpt: string;
}

export interface CompanionResult {
  answer: string;
  grounded: boolean;
  citations: Citation[];
  quotes: string[];
  mode: 'generated' | 'extractive' | 'not_found' | 'smalltalk' | 'quotes' | 'safety';
  retrieval: 'hybrid' | 'lexical';
}

let chunks: Chunk[] = [];
let quotes: string[] = [];
let loaded = false;
let embeddingsReady = false;

const sha = (s: string) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 24);

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(md|txt)$/i.test(e.name) && !/^readme\.md$/i.test(e.name) ? [p] : [];
  });
}

function chunkFile(file: string): Chunk[] {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/^>\s?/gm, '').trim();
  if (!raw) return [];
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const source = titleMatch ? titleMatch[1].trim() : path.basename(file);
  const body = raw.replace(/^#\s+.+$/m, '').trim();

  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: Chunk[] = [];
  let buf = '';
  const flush = () => {
    if (buf.trim()) {
      const text = buf.trim();
      out.push({ id: sha(`${source}|${text}`), source, text });
    }
    buf = '';
  };
  for (const p of paragraphs) {
    if (buf && buf.length + p.length > CHUNK_CHARS) {
      // keep the last paragraph as overlap so ideas spanning a boundary stay retrievable
      const lastPara = buf.split('\n\n').pop() || '';
      flush();
      buf = lastPara.length < CHUNK_CHARS / 2 ? lastPara : '';
    }
    buf = buf ? `${buf}\n\n${p}` : p;
  }
  flush();
  return out;
}

// ---------- lexical (BM25) ----------
const STOP = new Set(
  ('a an and are as at be but by can do does for from has have how i if in into is it its me my of on or our ' +
    'so than that the their then there these they this to was we were what when where which who why will with ' +
    'you your about book shunya tell explain say says mean means ' +
    // Hindi function words
    'है हैं था थी थे हो होता होती होते का की के को में से पर और या भी ही तो यह वह ये वो जो कि क्या कौन कैसे क्यों कब कहाँ ' +
    'नहीं एक इस उस इन उन तुम मैं हम वे लिए साथ बात कोई सब कुछ जब तब अगर लेकिन').split(' ')
);

// \p{M} keeps Devanagari vowel signs (ि ा ु ू ्) attached to their letters; without it Hindi words shatter.
function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) || [])
    .map((t) => (t.length > 5 ? t.replace(/(ing|ed)$/u, '') : t).replace(/(?<=[^s])s$/u, ''))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function bm25(query: string, docs: Chunk[]): { idx: number; score: number; hits: number }[] {
  const q = [...new Set(tokenize(query))];
  const toks = docs.map((d) => tokenize(d.text));
  const avg = toks.reduce((a, t) => a + t.length, 0) / Math.max(1, toks.length);
  const df = new Map<string, number>();
  for (const t of toks) for (const w of new Set(t)) df.set(w, (df.get(w) || 0) + 1);
  const N = docs.length;
  return toks.map((t, idx) => {
    const tf = new Map<string, number>();
    for (const w of t) tf.set(w, (tf.get(w) || 0) + 1);
    let score = 0;
    let hits = 0;
    for (const w of q) {
      const f = tf.get(w) || 0;
      if (!f) continue;
      hits++;
      const n = df.get(w) || 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (t.length / avg))));
    }
    return { idx, score, hits };
  });
}

// ---------- embeddings ----------
function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

// During indexing (waitOnRateLimit = true) a 429 is waited out using the retry delay the API reports;
// at chat time it is not, so a user never sits behind a rate-limit wait.
async function embed(ai: GoogleGenAI, texts: string[], taskType: string, waitOnRateLimit = false): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += 50) {
    for (let attempt = 0; ; attempt++) {
      try {
        const res = await ai.models.embedContent({
          model: EMBED_MODEL,
          contents: texts.slice(i, i + 50),
          config: { taskType },
        });
        for (const e of res.embeddings || []) out.push(e.values || []);
        break;
      } catch (err: any) {
        const msg = String(err?.message || '');
        if (!waitOnRateLimit || attempt >= 5 || !/429|RESOURCE_EXHAUSTED/.test(msg)) throw err;
        const m = msg.match(/retry in ([\d.]+)s/i) || msg.match(/"retryDelay":"([\d.]+)s"/);
        const waitMs = Math.ceil((m ? parseFloat(m[1]) : 60) * 1000) + 2000;
        console.warn(`RAG: embedding rate-limited, waiting ${Math.round(waitMs / 1000)}s then retrying...`);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  if (out.length !== texts.length) throw new Error('Embedding count mismatch');
  return out;
}

export async function buildIndex(ai: GoogleGenAI | null): Promise<{ chunks: number; embedded: boolean }> {
  const files = walk(KNOWLEDGE_DIR).sort();
  chunks = files.flatMap(chunkFile);
  quotes = files.flatMap((f) => (fs.readFileSync(f, 'utf8').match(/^>\s?(.+)$/gm) || []).map((l) => l.replace(/^>\s?/, '').trim())).filter(Boolean);
  loaded = true;
  embeddingsReady = false;

  if (!ai || chunks.length === 0) return { chunks: chunks.length, embedded: false };

  let cache: Record<string, number[]> = {};
  try {
    const parsed = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (parsed.model === EMBED_MODEL) cache = parsed.vectors || {};
  } catch {}

  const missing = chunks.filter((c) => !cache[c.id]);
  try {
    // Embed in batches and save the cache after each one, so a rate limit or crash midway keeps the progress.
    for (let i = 0; i < missing.length; i += 50) {
      const batch = missing.slice(i, i + 50);
      const vecs = await embed(ai, batch.map((c) => c.text), 'RETRIEVAL_DOCUMENT', true);
      batch.forEach((c, j) => (cache[c.id] = vecs[j]));
      fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
      fs.writeFileSync(CACHE_FILE, JSON.stringify({ model: EMBED_MODEL, vectors: cache }));
      console.log(`RAG: embedded ${Math.min(i + 50, missing.length)}/${missing.length} new chunks`);
    }
    for (const c of chunks) c.embedding = cache[c.id];
    embeddingsReady = true;
  } catch (err: any) {
    console.warn('RAG: embedding failed, using lexical retrieval only:', err.message);
  }
  return { chunks: chunks.length, embedded: embeddingsReady };
}

// Broad questions ("what is this book about", "motto of the book") share almost no words with the text,
// so keyword retrieval misses them. Expand them with the book's core vocabulary, differently per intent.
function expandBroadQuery(q: string): string | null {
  const t = q.toLowerCase();
  if (!/\b(book|shunya|author|this)\b/.test(t) && !/\b(mot+o|mot+to|tagline|theme|summary|gist|overview)\b/.test(t)) return null;
  if (/\b(mot+o|mot+to|tagline|slogan|central question|core question)\b/.test(t))
    return 'nothing left to prove build everything depend on nothing achieve without becoming';
  if (/\b(about|summary|summarize|summarise|theme|themes|message|purpose|main|gist|overview|idea|ideas|teach|teaches|lesson|learn|explain|mean|meaning)\b/.test(t))
    return 'identity freedom consciousness expectation samarpan zero borrowed observer';
  return null;
}

// ---------- retrieval ----------
// Conversational filler ("what does the book say about ...") matches the generic words in the English notes
// and drowns out the actual topic, so search on the topic words. The model still sees the full question.
const FILLER = new RegExp(
  '\\b(what|whats|what\'s|how|why|who|where|when|which|does|do|did|is|are|was|were|can|could|would|should|please|' +
    'tell|me|us|explain|describe|talk|talks|say|says|said|speak|speaks|mention|mentions|discuss|discusses|cover|covers|' +
    'according|to|about|regarding|on|the|this|that|book|author|writer|in|of|a|an)\\b',
  'gi'
);
function topicOf(q: string): string {
  const t = q.replace(FILLER, ' ').replace(/[?!.]+/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length >= 3 ? t : q;
}

// The book is Hindi; people will often ask in English. Keyword search cannot cross that gap, and embeddings
// only partly do, so add the book's own Hindi vocabulary for the themes the question mentions.
const GLOSSARY: [string, string][] = [
  ['death|die|dying|dead|mortality', 'मृत्यु मरना'],
  ['rebirth|reincarnat|afterlife|after death|life after', 'पुनर्जन्म मृत्यु के बाद'],
  ['god|divine|creator', 'ईश्वर'],
  ['creation|universe|who made|created', 'सृष्टि ईश्वर'],
  ['karma|action', 'कर्म'],
  ['fate|destiny|luck', 'भाग्य'],
  ['free will', 'स्वतंत्र इच्छा'],
  ['suffer|pain|sorrow|misery|unhappy', 'दुख'],
  ['purpose|meaning of life|why am i here', 'जीवन का उद्देश्य'],
  ['who am i|identity|true self|self\\b', 'मैं कौन हूँ आत्मा'],
  ['soul|atman', 'आत्मा'],
  ['love|romance|relationship|marriage|partner', 'प्रेम संबंध'],
  ['sex|lust|desire', 'काम इच्छा'],
  ['jealous|possessive', 'ईर्ष्या स्वामित्व'],
  ['fear|afraid|scared', 'भय'],
  ['anxiety|worry|stress|overthink', 'चिंता मन'],
  ['ego|pride|arrogan', 'अहंकार'],
  ['mind|thought|thinking', 'मन विचार'],
  ['guru|teacher|master|disciple', 'गुरु'],
  ['practice|sadhana|spiritual path', 'साधना'],
  ['meditat|dhyan', 'ध्यान'],
  ['moksha|liberat|freedom|free from|salvation|mukti', 'मुक्ति मोक्ष'],
  ['enlighten|awaken|awakening|jagran', 'जागरण बोध'],
  ['money|wealth|rich|poor|poverty|income', 'धन'],
  ['success|failure|ambition|career', 'सफलता असफलता'],
  ['society|duty|family|responsibilit', 'समाज कर्तव्य परिवार'],
  ['religion|religious|dharma', 'धर्म'],
  ['scripture|shastra|veda|holy book', 'शास्त्र'],
  ['priest|ritual|temple|puja', 'पुरोहित कर्मकांड मंदिर'],
  ['caste|untouchab|discriminat', 'जाति छुआछूत'],
  ['women|woman|gender', 'स्त्री'],
  ['violence|war', 'हिंसा युद्ध'],
  ['conspiracy|illusion|delusion', 'षड्यंत्र भ्रम'],
  ['buddha|buddhis', 'बुद्ध'],
  ['osho', 'ओशो'],
  ['lao ?tzu|laotse|tao', 'लाओत्से ताओ'],
  ['upanishad', 'उपनिषद'],
  ['ashtavakra|janak', 'अष्टावक्र जनक'],
  ['nagarjuna|emptiness|void|nothingness|shunya|zero', 'शून्य शून्यता'],
  ['witness|observer|awareness|consciousness', 'साक्षी चेतना'],
  ['bliss|joy|happiness|sat chit anand', 'आनंद सत् चित्'],
  ['truth|reality', 'सत्य'],
  ['silence|quiet', 'मौन'],
  ['breath', 'श्वास'],
  ['compassion|kindness|mercy', 'करुणा मैत्री'],
  ['attachment|clinging|grasp', 'पकड़ आसक्ति'],
  ['question|doubt|inquiry', 'प्रश्न'],
  ['free from|dissolv', 'विसर्जन'],
  ['author|preface|why .*write|why .*wrote', 'प्रस्तावना यह किताब मैंने क्यों लिखी'],
];

function hindiTermsFor(q: string): string {
  const t = q.toLowerCase();
  const out: string[] = [];
  for (const [en, hi] of GLOSSARY) if (new RegExp(`\\b(${en})`).test(t)) out.push(hi);
  return out.join(' ');
}

// `query` is what we search on (topic words plus Hindi vocabulary); `raw` is the user's own wording.
// Both are embedded: the topic form ranks the right chapters, the raw form keeps the similarity score honest.
async function retrieve(ai: GoogleGenAI | null, query: string, raw: string = query) {
  const lex = bm25(query, chunks);
  const lexRank = [...lex].sort((a, b) => b.score - a.score);

  let vecScoreSets: number[][] = [];
  if (ai && embeddingsReady) {
    try {
      const qvs = await embed(ai, [...new Set([query, raw])], 'RETRIEVAL_QUERY');
      vecScoreSets = qvs.map((qv) => chunks.map((c) => (c.embedding ? cosine(qv, c.embedding) : 0)));
    } catch (err: any) {
      console.warn('RAG: query embedding failed, lexical only:', err.message);
    }
  }
  const vecScores: number[] | null = vecScoreSets.length
    ? chunks.map((_, i) => Math.max(...vecScoreSets.map((s) => s[i])))
    : null;

  // Reciprocal rank fusion of lexical + vector rankings
  const fused = new Map<number, number>();
  lexRank.forEach((r, rank) => {
    if (r.score > 0) fused.set(r.idx, (fused.get(r.idx) || 0) + 1 / (60 + rank));
  });
  for (const scores of vecScoreSets) {
    scores
      .map((s, idx) => ({ s, idx }))
      .sort((a, b) => b.s - a.s)
      .forEach((r, rank) => fused.set(r.idx, (fused.get(r.idx) || 0) + 1 / (60 + rank)));
  }

  // An English question is always closer, in embedding space, to the short English notes than to the Hindi
  // chapters that actually hold the book's teaching. Give real book chunks a modest edge so the full text wins
  // ties; the notes still surface when they are clearly the better match (e.g. Codagram questions).
  for (const [idx, score] of fused) if (BOOK_SOURCE.test(chunks[idx].source)) fused.set(idx, score * BOOK_BOOST);

  const top = [...fused.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP_K).map(([idx]) => idx);

  // Relevance gate: refuse to answer when nothing in the book is actually close to the question.
  const bestVec = vecScores ? Math.max(...vecScores) : 0;
  const bestHits = Math.max(0, ...lex.map((l) => l.hits));
  const qTerms = new Set(tokenize(query)).size;
  const lexicalOk = bestHits >= 2 || (qTerms > 0 && bestHits / qTerms >= 0.5);
  const relevant = vecScores ? bestVec >= MIN_VECTOR_SCORE || lexicalOk : lexicalOk;

  return { passages: top.map((i) => chunks[i]), relevant, retrieval: vecScores ? ('hybrid' as const) : ('lexical' as const) };
}

// ---------- small talk ----------
// Handled without retrieval so "hello" gets a hello. Only matches when the WHOLE message is small talk;
// "hello, what is samarpan?" falls through to the book.
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const BOOK_HINT = 'Ask me about *Shunya: Sat Chit Anand* (identity, freedom, samarpan, zero), or about Codagram and Shubham Kasar.';

export function smallTalkReply(query: string): string | null {
  const q = query.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return null;
  const is = (re: RegExp) => re.test(q);

  if (is(/^(hi+|hii+|hello+|hey+|heya|hola|namaste|namaskar|yo|sup|good (morning|afternoon|evening)|greetings)( (there|friend|bot|buddy))?$/))
    return pick(['Hello! 🙏', 'Hi there!', 'Namaste 🙏', 'Hey! Good to see you.']) + ' ' + BOOK_HINT;
  if (is(/^(how are you|how are you doing|how r u|how do you do|whats up|what s up|how is it going|how s it going)( today)?$/))
    return "I'm doing well, thank you for asking. How are you? " + BOOK_HINT;
  if (is(/^(i am |i m |im )?(fine|good|great|well|ok|okay|alright|not bad|doing well|doing good)( thanks| thank you)?$/))
    return "Glad to hear it. What would you like to explore? " + BOOK_HINT;
  if (is(/^(thanks|thank you|thank you so much|thx|ty|thanks a lot|many thanks|dhanyavad|shukriya)$/))
    return pick(["You're welcome! 🙏 Anything else you'd like to ask?", 'Happy to help. Ask away whenever you like.']);
  if (is(/^(bye|goodbye|see you|see ya|good night|take care|cya)( later| soon)?$/))
    return pick(['Goodbye 🙏 Come back anytime.', 'Take care. Be well.']);
  if (is(/^(who are you|what are you|what is your name|whats your name|what s your name|introduce yourself)$/))
    return "I'm the assistant for Shubham Kasar's site. I can talk about his book *Shunya: Sat Chit Anand*, Codagram, and Shubham himself. I answer only from the material I've been given and tell you honestly when I don't know. I'm an AI, not the author.";
  if (is(/^(what can you do|help|what do you do|how can you help( me)?|what can i ask( you)?|how does this work)$/))
    return "I can discuss the ideas in *Shunya: Sat Chit Anand* and quote the passages I draw from, and answer questions about Codagram's tracks, fees and admissions, and about Shubham Kasar. Try: “What does Shunya mean?”, “What is samarpan?”, or “How much is the Codagram fee?”";
  if (is(/^(ok|okay|cool|nice|great|wow|hmm+|hm+|i see|got it|alright|sure|yes|no)$/))
    return 'Take your time. Whenever you have a question about the book, I\'m here.';
  return null;
}

// ---------- safety ----------
// People who are in danger must never get "I don't have that in my knowledge base". These messages are caught
// BEFORE retrieval or any model call and answered with a fixed, India-specific reply (English, or Hindi when the
// message is written in Devanagari). Numbers checked against official sources: 112 national emergency number,
// 108 ambulance (varies by state), Tele-MANAS 14416 (MoHFW, free, 24x7), KIRAN 1800-599-0019 (free, 24x7).
// Re-verify the helpline numbers occasionally; they are government services and can change.
const safetyNorm = (s: string) =>
  s.normalize('NFC').toLowerCase().replace(/़/g, '').replace(/ँ/g, 'ं').replace(/[“”"'‘’]/g, '').replace(/\s+/g, ' ').trim();

const SELF_HARM = [
  /\b(suicid\w*|kill (my ?self)|end (my|this) life|end it all|take my (own )?life|(want|wanted|wanna|going) to die|wanna die|(don'?t|do not|dont) want to (live|be alive|exist)|no reason to (live|go on)|better off (dead|without me)|(hurt|harm|cut|hang|kill)(ing)? my ?self|self[- ]?harm)\b/,
  /आत्म ?हत्या|खुद ?कुशी|खुद ?खुशी|(मरना|मर जाना|मर जाने) (चाहता|चाहती|का मन|की इच्छा)|(जीना|जीने) (नहीं|नही) चाह|जीने (का मन|की इच्छा) (नहीं|नही)|जान दे (दूं|दूंगा|दूंगी|देना|दूं)|अपनी जान ल|खुद को (खत्म|मार)|अपनी (जिंदगी|जीवन) (खत्म|समाप्त) कर/,
  /\b(marna chah|mar jana chah|mar jaana chah|mar jaun|jeena nahi|jeene ka (mann|man|mood) nahi|jeene ki (ichha|iccha) nahi|khud ?kushi|aatm ?hatya|atm ?hatya|jaan de (dunga|dungi|du)\b|jaan dena chah|apni jaan l|khud ko (khatam|maar))/,
];
// "I want to die to my ego" is a spiritual idiom, not a crisis.
const SPIRITUAL_DEATH = /\b(die|dying|death) (to|of) (my |the |your )?(ego|self|mind)\b|\bego death\b/;

const EMERGENCY = [
  /\b(chest pain|pain in (my |the )?chest|heart attack|can'?t breathe|cannot breathe|unable to breathe|(shortness|difficulty|trouble) (of|in|with) breath(ing)?|(having|had|got) a stroke|seizure|unconscious|passed out|overdos\w*|took too many (pills|tablets)|swallowed (poison|pills|bleach)|(been|got|was|am) poisoned|bleeding (heavily|a lot|badly)|severe bleeding|choking|anaphyla\w*)\b/,
  /सीने में दर्द|छाती में दर्द|सांस नहीं (ले|आ)|दिल का दौरा|हार्ट अटैक|बेहोश|जहर (खा|पी)|ओवरडोज|खून (बह|बहुत)/,
  /\b(seene mein dard|chhati mein dard|saans nahi (le|aa)|behosh|zeher (kha|pi))/,
];

const MED_ADVICE = [
  /\b(what|which) (medicine|medication|tablets?|drugs?|antibiotics?|painkillers?)\b|\b(should|can|could) i take\b.{0,40}\b(medicine|medication|tablets?|pills?|mg|ibuprofen|paracetamol|aspirin|antibiotic)\b|\b(dosage|how many mg|how much (medicine|paracetamol|ibuprofen)|diagnose|prescribe|prescription)\b|\bwhat (disease|illness|condition) do i have\b/,
  /कौन ?-? ?सी (दवा|दवाई|गोली)|दवा (लूं|लें)|दवाई (लूं|बताओ|बताइए)|खुराक/,
  /\b(kaun si dawa|konsi dawa|dawa (lu|batao|kaun)|dawai (lu|batao))\b/,
];

const SAFETY_TEXT = {
  selfHarm: {
    en:
      "I'm really sorry you're feeling this way, and I'm glad you said it. You don't have to carry this alone.\n\n" +
      'Please reach out to someone right now:\n' +
      '• Tele-MANAS (free, 24x7, Government of India): 14416 or 1-800-891-4416\n' +
      '• KIRAN mental health helpline (free, 24x7): 1800-599-0019\n' +
      '• If you are in immediate danger, call 112.\n\n' +
      "If you can, tell someone you trust, a friend or a family member, that you're not okay, and ask them to stay with you. I'm an AI, and I can't give you the support a real person can.",
    hi:
      'मुझे बहुत अफ़सोस है कि आप ऐसा महसूस कर रहे हैं, और अच्छा है कि आपने यह कहा। आपको यह अकेले नहीं सहना है।\n\n' +
      'कृपया अभी किसी से बात करें:\n' +
      '• Tele-MANAS (मुफ़्त, 24x7, भारत सरकार): 14416 या 1-800-891-4416\n' +
      '• KIRAN मानसिक स्वास्थ्य हेल्पलाइन (मुफ़्त, 24x7): 1800-599-0019\n' +
      '• अगर आप तुरंत ख़तरे में हैं, तो 112 पर कॉल करें।\n\n' +
      'अगर हो सके तो किसी भरोसेमंद व्यक्ति, दोस्त या परिवार के किसी सदस्य, को बताइए कि आप ठीक नहीं हैं और उनसे अपने साथ रहने को कहिए। मैं एक AI हूँ, और किसी इंसान जैसा साथ नहीं दे सकता।',
  },
  emergency: {
    en:
      "This sounds like it could be a medical emergency, and I can't help with that. Please act now:\n" +
      '• Call 112 (emergency) or 108 (ambulance), or go to the nearest hospital.\n' +
      '• If someone is with you, ask them to stay and help.\n\n' +
      'I can only answer questions about the book, Codagram and Shubham Kasar.',
    hi:
      'यह मेडिकल इमरजेंसी हो सकती है, और इसमें मदद करना मेरे बस में नहीं है। कृपया अभी:\n' +
      '• 112 (इमरजेंसी) या 108 (एम्बुलेंस) पर कॉल करें, या नज़दीकी अस्पताल जाएँ।\n' +
      '• अगर कोई आपके पास है, तो उन्हें रुकने और मदद करने को कहें।',
  },
  advice: {
    en:
      "I can't give medical advice, including about medicines, doses or symptoms. Please speak to a doctor or pharmacist. If it's an emergency, call 112 or 108.",
    hi:
      'दवाओं, खुराक या लक्षणों के बारे में मेडिकल सलाह देना मेरे लिए संभव नहीं है। कृपया किसी डॉक्टर या फार्मासिस्ट से बात करें। इमरजेंसी हो तो 112 या 108 पर कॉल करें।',
  },
};

export function safetyReply(query: string): string | null {
  const q = safetyNorm(query);
  if (!q) return null;
  const hi = /[ऀ-ॿ]/.test(query) ? 'hi' : 'en';
  const any = (res: RegExp[]) => res.some((r) => r.test(q));
  if (any(SELF_HARM) && !SPIRITUAL_DEATH.test(q)) return SAFETY_TEXT.selfHarm[hi];
  if (any(EMERGENCY)) return SAFETY_TEXT.emergency[hi];
  if (any(MED_ADVICE)) return SAFETY_TEXT.advice[hi];
  return null;
}

// ---------- quotes ----------
const NUMBER_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

function quoteReply(query: string): string | null {
  const q = query.toLowerCase();
  if (!/\b(quotes?|best lines?|famous lines?|favou?rite lines?|memorable lines?|top lines?|one[- ]?liners?|best sentences?|key lines?)\b/.test(q)) return null;
  if (!/\b(book|shunya|author|shubham|this)\b/.test(q) && !/\b(quotes?|lines?)\b/.test(q)) return null;
  if (quotes.length === 0) return null;
  const digit = q.match(/\b(\d{1,2})\b/);
  const word = Object.keys(NUMBER_WORDS).find((w) => new RegExp(`\\b${w}\\b`).test(q));
  const plural = /\b(quotes|lines|liners|sentences)\b/.test(q);
  const want = digit ? Number(digit[1]) : word ? NUMBER_WORDS[word] : plural ? 5 : 1;
  const n = Math.max(1, Math.min(want, quotes.length));
  const list = quotes.slice(0, n).map((t, i) => (n === 1 ? `“${t}”` : `${i + 1}. “${t}”`)).join('\n\n');
  const short = want > quotes.length ? `\n\n(I only have ${quotes.length} signature lines on file right now. More appear as the book is added.)` : '';
  return `${n === 1 ? 'A line' : `${n} lines`} from *Shunya: Sat Chit Anand*:\n\n${list}${short}`;
}

// ---------- generation ----------
const norm = (s: string) => s.toLowerCase().replace(/[“”"'‘’]/g, '').replace(/\s+/g, ' ').trim();

const SYSTEM = `You are the assistant on Shubham Kasar's website. You answer questions about his book "Shunya: Sat Chit Anand", about Codagram, and about Shubham Kasar, using ONLY the provided passages.

STRICT RULES
1. Use ONLY the numbered PASSAGES provided. Never use outside knowledge, never invent quotes, chapters, examples, anecdotes, or facts about the author.
2. If the passages do not contain the answer, set "answerable" to false and leave "answer" empty. A partial answer is allowed only for the part the passages support; say plainly what the book does not cover.
3. Every sentence of the answer that states an idea from the book must end with its passage number(s) like [1] or [2][3].
4. "quotes" must be exact, word-for-word substrings copied from the passages (max 2, each under 200 characters). If unsure, return an empty list.
5. Tone: warm, natural and conversational. For philosophical questions about the book be gentle and reflective, never a guru or preacher, and you may end with one reflective question that follows from the passages. For factual questions (fees, tracks, contact) be direct and precise, and never change a number, price or name.
6. Do not give medical, legal, or financial advice. Do not claim to be the author.`;

const SCHEMA = {
  type: 'object',
  properties: {
    answerable: { type: 'boolean' },
    answer: { type: 'string' },
    citations: { type: 'array', items: { type: 'integer' } },
    quotes: { type: 'array', items: { type: 'string' } },
  },
  required: ['answerable', 'answer', 'citations', 'quotes'],
};

const excerpt = (t: string) => (t.length > 220 ? `${t.slice(0, 217).trimEnd()}...` : t);

// How long to skip a model after it fails. A quota error says exactly when it will work again (the free tier
// caps some models at a few requests per DAY, so that can be hours); anything else gets a short fixed pause.
function cooldownFor(err: any): number {
  const msg = String(err?.message || '');
  if (/429|RESOURCE_EXHAUSTED/.test(msg)) {
    const m = msg.match(/"retryDelay":"([\d.]+)s"/) || msg.match(/retry in ([\d.]+)s/i);
    if (m) return Math.min(parseFloat(m[1]) * 1000 + 1000, 24 * 60 * 60 * 1000);
  }
  return MODEL_COOLDOWN_MS;
}

// Try the main model, then a lighter one. A slow or overloaded model (503, hang) must not break the chat.
async function generateWithFallback(ai: GoogleGenAI, params: any) {
  const all = [...new Set([ANSWER_MODEL, FALLBACK_MODEL])];
  // Skip a model that failed recently so users aren't made to wait on it again (unless it is the only one).
  const healthy = all.filter((m) => (modelDownUntil.get(m) || 0) < Date.now());
  let models: string[];
  if (healthy.length) {
    models = healthy;
  } else {
    // Everything is on cooldown. Try the model that comes back soonest, and leave out any that are down for
    // much longer (e.g. a daily quota that is used up) so we don't keep calling a model that cannot answer.
    const byReturn = [...all].sort((a, b) => (modelDownUntil.get(a) || 0) - (modelDownUntil.get(b) || 0));
    const soonest = modelDownUntil.get(byReturn[0]) || 0;
    models = byReturn.filter((m) => (modelDownUntil.get(m) || 0) - soonest < 60_000);
  }
  // With no backup to hedge against, give the one usable model longer before giving up.
  const timeoutMs = models.length === 1 ? MODEL_TIMEOUT_SOLO_MS : MODEL_TIMEOUT_MS;

  // Hedged: if the first model has not answered after HEDGE_MS, start the next one in parallel and take
  // whichever succeeds first. A failure starts the next model immediately. This keeps an overloaded
  // main model from adding its full timeout to every answer.
  return new Promise<any>((resolve, reject) => {
    let done = false;
    let launched = 0;
    let failed = 0;
    let lastErr: any;
    const launchNext = () => {
      if (done || launched >= models.length) return;
      const model = models[launched++];
      const hedge = launched < models.length ? setTimeout(launchNext, MODEL_HEDGE_MS) : null;
      Promise.race([
        ai.models.generateContent({ ...params, model }),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error(`timeout after ${timeoutMs}ms (${model})`)), timeoutMs)),
      ]).then(
        (res) => {
          if (hedge) clearTimeout(hedge);
          if (!done) { done = true; resolve(res); }
        },
        (err: any) => {
          if (hedge) clearTimeout(hedge);
          lastErr = err;
          const pause = cooldownFor(err);
          modelDownUntil.set(model, Date.now() + pause);
          console.warn(`RAG: ${model} failed, skipping it for ${Math.round(pause / 1000)}s (${String(err.message).slice(0, 120)})`);
          failed++;
          if (done) return;
          if (failed >= models.length) { done = true; reject(lastErr); }
          else launchNext();
        }
      );
    };
    launchNext();
  });
}

// Identical first-turn questions reuse the last answer, which saves model quota (free keys allow only a few requests/min).
const answerCache = new Map<string, { at: number; result: CompanionResult }>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function askCompanion(
  ai: GoogleGenAI | null,
  query: string,
  history: { role: string; content: string }[] = []
): Promise<CompanionResult> {
  const key = history.length === 0 ? norm(query) : '';
  if (key) {
    const hit = answerCache.get(key);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.result;
  }
  const result = await answerQuery(ai, query, history);
  if (key && result.mode === 'generated') {
    if (answerCache.size > 200) answerCache.clear();
    answerCache.set(key, { at: Date.now(), result });
  }
  return result;
}

async function answerQuery(
  ai: GoogleGenAI | null,
  query: string,
  history: { role: string; content: string }[] = []
): Promise<CompanionResult> {
  const safety = safetyReply(query);
  if (safety) {
    return { answer: safety, grounded: false, citations: [], quotes: [], mode: 'safety', retrieval: 'lexical' };
  }

  const chat = smallTalkReply(query);
  if (chat) {
    return { answer: chat, grounded: false, citations: [], quotes: [], mode: 'smalltalk', retrieval: 'lexical' };
  }

  if (!loaded) await buildIndex(ai);

  const quoted = quoteReply(query);
  if (quoted) {
    return { answer: quoted, grounded: true, citations: [], quotes: [], mode: 'quotes', retrieval: 'lexical' };
  }

  const notFound = (retrieval: 'hybrid' | 'lexical'): CompanionResult => ({
    answer: NOT_IN_BOOK_REPLY, grounded: false, citations: [], quotes: [], mode: 'not_found', retrieval,
  });

  if (chunks.length === 0) return notFound('lexical');

  // Fold the last user turns into the retrieval query so follow-ups like "why is that?" still retrieve well.
  const priorUser = history.filter((m) => m.role === 'user').slice(-2).map((m) => m.content);
  const rawQuery = [...priorUser, query].join(' \n ').slice(-1200);
  const retrievalQuery = [...priorUser, `${topicOf(query)} ${hindiTermsFor(query)}`].join(' \n ').slice(-1200);

  const broad = expandBroadQuery(query);
  const r = await retrieve(ai, broad ? `${retrievalQuery} ${broad}` : retrievalQuery, rawQuery);
  const { passages, retrieval } = r;
  const relevant = r.relevant || (broad !== null && passages.length > 0);
  if (!relevant || passages.length === 0) return notFound(retrieval);

  const citationsAll: Citation[] = passages.map((p, i) => ({ n: i + 1, source: p.source, excerpt: excerpt(p.text) }));
  const extractive = (why = "The assistant is unavailable right now, so I can't write a full answer."): CompanionResult => ({
    answer: `${why} In the meantime, here are the passages from the book closest to your question:\n\n` +
      passages.map((p, i) => `[${i + 1}] ${p.source}\n${p.text}`).join('\n\n'),
    grounded: true, citations: citationsAll, quotes: [], mode: 'extractive', retrieval,
  });

  if (!ai) return extractive();

  const context = passages.map((p, i) => `[${i + 1}] (${p.source})\n${p.text}`).join('\n\n');
  const convo = history.slice(-6).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const res = await generateWithFallback(ai, {
      contents: [
        ...convo,
        { role: 'user', parts: [{ text: `PASSAGES\n${context}\n\nQUESTION\n${query}` }] },
      ],
      config: {
        systemInstruction: SYSTEM,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: SCHEMA as any,
      },
    });

    const parsed = JSON.parse(res.text || '{}');
    if (!parsed.answerable || !String(parsed.answer || '').trim()) return notFound(retrieval);

    // Only keep citation numbers that point at real passages.
    const cited = new Set<number>();
    for (const m of String(parsed.answer).matchAll(/\[(\d+)\]/g)) cited.add(Number(m[1]));
    for (const n of parsed.citations || []) cited.add(Number(n));
    const valid = [...cited].filter((n) => n >= 1 && n <= passages.length);
    if (valid.length === 0) return notFound(retrieval); // uncited answer = unsupported, reject

    // Keep only quotes that literally appear in the retrieved passages.
    const haystack = norm(passages.map((p) => p.text).join(' '));
    const quotes = (parsed.quotes || []).filter((q: string) => q && norm(q).length > 8 && haystack.includes(norm(q)));

    return {
      answer: String(parsed.answer).trim(),
      grounded: true,
      citations: citationsAll.filter((c) => valid.includes(c.n)),
      quotes,
      mode: 'generated',
      retrieval,
    };
  } catch (err: any) {
    console.warn('RAG: generation failed, returning extractive passages:', err.message);
    const busy = /429|quota|rate/i.test(String(err.message));
    return extractive(busy ? "The assistant is busy right now (its request limit was reached), so I can't write a full answer. Please try again shortly." : undefined);
  }
}

export function ragStatus() {
  return { loaded, chunks: chunks.length, embedded: embeddingsReady, answerModel: ANSWER_MODEL, embedModel: EMBED_MODEL };
}
