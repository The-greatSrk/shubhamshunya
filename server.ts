import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Read Firebase config from firebase-applet-config.json
let firebaseApp: any = null;
let firestoreDb: any = null;

try {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(rawConfig);
    firestoreDb = getFirestore(firebaseApp, rawConfig.firestoreDatabaseId);
    console.log('Cloud Firestore successfully initialized on backend server.');
  }
} catch (e) {
  console.warn('Backend Firestore initialization warning:', e);
}

// In-memory fallback stores for zero-downtime resilience
interface OrderRecord {
  orderId: string;
  itemType: 'book' | 'course_registration';
  itemName: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  shippingAddress?: string;
  utrNumber?: string;
  status: 'pending_verification' | 'verified' | 'fulfilled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface PaymentConfigRecord {
  upiId: string;
  payeeName: string;
  currency: string;
  updatedAt: string;
}

let activePaymentConfig: PaymentConfigRecord = {
  upiId: 'shubhamkasar@upi',
  payeeName: 'Shubham Kasar',
  currency: 'INR',
  updatedAt: new Date().toISOString(),
};

const ordersStore: OrderRecord[] = [
  {
    orderId: 'ORD-1001',
    itemType: 'book',
    itemName: 'Shunya: Hardcover Collector Edition',
    amount: 799,
    buyerName: 'Vikram Joshi',
    buyerEmail: 'vikram.j@example.com',
    buyerPhone: '+91 98230 11223',
    shippingAddress: 'Kothrud, Pune, MH 411038',
    utrNumber: '429182749102',
    status: 'verified',
    createdAt: '2026-10-12T10:20:00Z',
    updatedAt: '2026-10-12T11:00:00Z',
  },
  {
    orderId: 'ORD-1002',
    itemType: 'course_registration',
    itemName: 'Full Stack & Distributed Systems Cohort',
    amount: 999,
    buyerName: 'Pooja Kulkarni',
    buyerEmail: 'pooja.k@example.com',
    buyerPhone: '+91 99220 44556',
    utrNumber: '429198371923',
    status: 'pending_verification',
    createdAt: '2026-10-13T08:45:00Z',
    updatedAt: '2026-10-13T08:45:00Z',
  },
];

interface Submission {
  id: string;
  type: 'student_application' | 'employer_inquiry' | 'talk_request' | 'college_partner';
  data: Record<string, any>;
  createdAt: string;
  status: 'received' | 'reviewing' | 'connected';
}

const submissionsStore: Submission[] = [
  {
    id: 'SUB-8921',
    type: 'student_application',
    data: {
      name: 'Aditya Patil',
      email: 'aditya.p@example.com',
      track: 'Full Stack & AI Systems',
      background: 'B.Tech CS 3rd Year',
      motivation: 'Want to build real production systems instead of theoretical projects.',
    },
    createdAt: '2026-10-12T14:30:00Z',
    status: 'reviewing',
  },
  {
    id: 'SUB-8922',
    type: 'employer_inquiry',
    data: {
      company: 'Zenith Labs',
      contactName: 'Neha Deshmukh',
      role: 'Founding Engineer / Full-Stack',
      headcount: 2,
      skills: ['TypeScript', 'FastAPI', 'Distributed Systems'],
    },
    createdAt: '2026-10-13T09:15:00Z',
    status: 'connected',
  },
];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function checkGeminiKey(res: Response): boolean {
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured. Please set a valid key in Settings > Secrets.',
    });
    return false;
  }
  return true;
}

// ==========================================
// UPI PAYMENT CONFIG & ORDERS ENDPOINTS
// ==========================================

// 1. Get current UPI recipient settings
app.get('/api/settings/upi', async (_req: Request, res: Response) => {
  if (firestoreDb) {
    try {
      const snap = await getDoc(doc(firestoreDb, 'settings', 'payment_config'));
      if (snap.exists()) {
        activePaymentConfig = snap.data() as PaymentConfigRecord;
      }
    } catch (e) {
      console.warn('Error reading UPI config from Firestore:', e);
    }
  }
  res.json(activePaymentConfig);
});

// 2. Update UPI recipient settings (used by Shubham in Admin Dashboard)
app.post('/api/settings/upi', async (req: Request, res: Response) => {
  const { upiId, payeeName, currency = 'INR' } = req.body;
  if (!upiId) {
    return res.status(400).json({ error: 'Valid UPI ID is required (e.g. yourname@upi)' });
  }

  activePaymentConfig = {
    upiId: upiId.trim(),
    payeeName: (payeeName || 'Shubham Kasar').trim(),
    currency: currency || 'INR',
    updatedAt: new Date().toISOString(),
  };

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'settings', 'payment_config'), activePaymentConfig);
    } catch (e) {
      console.warn('Error persisting UPI config to Firestore:', e);
    }
  }

  res.json({
    success: true,
    message: 'UPI Payment destination updated successfully.',
    config: activePaymentConfig,
  });
});

// 3. Create a new Order (for Shunya books or Codagram cohorts)
app.post('/api/orders', async (req: Request, res: Response) => {
  const { itemType, itemName, amount, buyerName, buyerEmail, buyerPhone, shippingAddress, utrNumber } = req.body;
  if (!itemName || !amount || !buyerName || !buyerEmail) {
    return res.status(400).json({ error: 'itemName, amount, buyerName, and buyerEmail are required.' });
  }

  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newOrder: OrderRecord = {
    orderId,
    itemType: itemType || 'book',
    itemName,
    amount: Number(amount),
    buyerName,
    buyerEmail,
    buyerPhone: buyerPhone || '',
    shippingAddress: shippingAddress || '',
    utrNumber: utrNumber || '',
    status: utrNumber ? 'pending_verification' : 'pending_verification',
    createdAt: now,
    updatedAt: now,
  };

  // Pre-generate dynamic UPI intent string for client apps
  const cleanUpi = activePaymentConfig.upiId;
  const cleanPayee = encodeURIComponent(activePaymentConfig.payeeName);
  const upiIntentUrl = `upi://pay?pa=${cleanUpi}&pn=${cleanPayee}&am=${amount}&tn=Order%20${orderId}&cu=INR`;

  // Store in-memory
  ordersStore.unshift(newOrder);

  // Store in Cloud Firestore
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'orders', orderId), newOrder);
    } catch (e) {
      console.warn('Error saving order to Firestore:', e);
    }
  }

  res.json({
    success: true,
    order: newOrder,
    upiIntentUrl,
    activeUpiId: cleanUpi,
    payeeName: activePaymentConfig.payeeName,
  });
});

// 4. List all orders (for Admin Dashboard)
app.get('/api/orders', async (_req: Request, res: Response) => {
  if (firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, 'orders'));
      if (!snap.empty) {
        const firestoreOrders: OrderRecord[] = [];
        snap.forEach((d) => firestoreOrders.push(d.data() as OrderRecord));
        // Sort descending
        firestoreOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.json({ orders: firestoreOrders });
      }
    } catch (e) {
      console.warn('Error querying orders from Firestore:', e);
    }
  }
  res.json({ orders: ordersStore });
});

// 5. Update order status (Admin verification or fulfilment)
app.patch('/api/orders/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, utrNumber } = req.body;

  const existing = ordersStore.find((o) => o.orderId === id);
  if (existing) {
    if (status) existing.status = status;
    if (utrNumber) existing.utrNumber = utrNumber;
    existing.updatedAt = new Date().toISOString();
  }

  if (firestoreDb) {
    try {
      const updatePayload: Record<string, any> = { updatedAt: new Date().toISOString() };
      if (status) updatePayload.status = status;
      if (utrNumber) updatePayload.utrNumber = utrNumber;
      await updateDoc(doc(firestoreDb, 'orders', id), updatePayload);
    } catch (e) {
      console.warn('Error updating order in Firestore:', e);
    }
  }

  res.json({ success: true, order: existing });
});

// ==========================================
// SUBMISSIONS & INQUIRIES ENDPOINTS
// ==========================================

app.post('/api/submissions', async (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res.status(400).json({ error: 'Type and data are required' });
  }

  const id = `SUB-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();
  const newSubmission: Submission = {
    id,
    type,
    data,
    createdAt: now,
    status: 'received',
  };

  submissionsStore.unshift(newSubmission);

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'submissions', id), {
        submissionId: id,
        type,
        data,
        status: 'received',
        createdAt: now,
      });
    } catch (e) {
      console.warn('Error saving submission to Firestore:', e);
    }
  }

  res.json({
    success: true,
    id,
    message: 'Your inquiry has reached Shubham Kasar & the Codagram team directly.',
    status: 'received',
  });
});

app.get('/api/submissions', async (_req: Request, res: Response) => {
  if (firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, 'submissions'));
      if (!snap.empty) {
        const firestoreSubs: Submission[] = [];
        snap.forEach((d) => {
          const item = d.data();
          firestoreSubs.push({
            id: item.submissionId || d.id,
            type: item.type,
            data: item.data,
            status: item.status,
            createdAt: item.createdAt,
          });
        });
        firestoreSubs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.json({ submissions: firestoreSubs });
      }
    } catch (e) {
      console.warn('Error querying submissions from Firestore:', e);
    }
  }
  res.json({ submissions: submissionsStore });
});

app.patch('/api/submissions/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const target = submissionsStore.find((s) => s.id === id);
  if (target && status) {
    target.status = status;
  }

  if (firestoreDb) {
    try {
      await updateDoc(doc(firestoreDb, 'submissions', id), { status });
    } catch (e) {
      console.warn('Error updating submission in Firestore:', e);
    }
  }

  res.json({ success: true, status });
});

// ==========================================
// STUDENT SUCCESS & TESTIMONIALS ENDPOINTS
// ==========================================

interface TestimonialRecord {
  id: string;
  studentName: string;
  cohortTrack: string;
  currentRole: string;
  quote: string;
  projectTitle: string;
  projectMetrics: string;
  skills: string[];
  createdAt: string;
}

const testimonialsStore: TestimonialRecord[] = [
  {
    id: 'TEST-101',
    studentName: 'Rohan Kulkarni',
    cohortTrack: 'Full Stack & Distributed Systems',
    currentRole: 'Backend Engineer at Zenith Scale',
    quote: 'In college I spent four years memorizing syntax trees without ever running a concurrent service. At Codagram, within eight weeks I was debugging race conditions in Redis and deploying real distributed outbox queues. That proof of work got me hired directly without an ATS filter.',
    projectTitle: 'Distributed Outbox Transactional Engine',
    projectMetrics: '12,000 writes/sec with zero message loss under simulated network partitions',
    skills: ['Go', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
    createdAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'TEST-102',
    studentName: 'Tanvi Mahajan',
    cohortTrack: 'AI Engineering & LLM Systems',
    currentRole: 'Founding AI Engineer at ContractLens',
    quote: 'Codagram ruined standard tutorials for me in the best way possible. Shubham insisted we stop writing toy wrappers and learn how to implement structured grounding, self-evaluating agents, and vector indexes. Capability gave me the confidence to walk into startup interviews as a builder.',
    projectTitle: 'Self-Grounding Legal Contract Analysis Agent',
    projectMetrics: 'Parsed 150-page contracts with 94% clause extraction precision and source citations',
    skills: ['Python', 'Gemini API', 'FastAPI', 'ChromaDB', 'Next.js'],
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'TEST-103',
    studentName: 'Sanket Sawant',
    cohortTrack: 'Cloud Infrastructure & Reliability',
    currentRole: 'DevOps Associate at HyperCloud',
    quote: 'The difference between learning from videos and building at Codagram is accountability. When your Kubernetes ingress goes down during a load test, you learn how Linux networking actually works. A certificate proves you sat down; a live cluster proves you can do the job.',
    projectTitle: 'Multi-Region Kubernetes Ephemeral Preview Pipeline',
    projectMetrics: 'Cut deployment turnaround from 22 minutes to 2.5 minutes with isolated staging',
    skills: ['Kubernetes', 'Terraform', 'Linux', 'AWS', 'Grafana'],
    createdAt: '2026-10-04T09:15:00Z',
  },
  {
    id: 'TEST-104',
    studentName: 'Aanya Deshpande',
    cohortTrack: 'Bio-Computing & Scientific Intelligence',
    currentRole: 'Computational Biology Researcher',
    quote: 'The intersection of computer science and biology is rarely taught practically. At Codagram’s frontier lab, I learned to integrate AlphaFold DB APIs, analyze pLDDT confidence scores, and parse genomic variants into interactive visualizers. It opened doors traditional universities couldn\'t even see.',
    projectTitle: 'AlphaFold Variant & Confidence Visualizer Workbench',
    projectMetrics: 'Mapped 200,000+ protein structural records with sub-450ms query latency',
    skills: ['Python', 'AlphaFold API', 'UniProt REST', '3Dmol.js', 'React'],
    createdAt: '2026-10-10T11:20:00Z',
  },
];

app.get('/api/testimonials', async (_req: Request, res: Response) => {
  if (firestoreDb) {
    try {
      const snap = await getDocs(collection(firestoreDb, 'testimonials'));
      if (!snap.empty) {
        const firestoreTestimonials: TestimonialRecord[] = [];
        snap.forEach((d) => firestoreTestimonials.push(d.data() as TestimonialRecord));
        firestoreTestimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.json({ testimonials: firestoreTestimonials });
      }

      // Seed if collection is currently empty
      for (const item of testimonialsStore) {
        await setDoc(doc(firestoreDb, 'testimonials', item.id), item);
      }
    } catch (e) {
      console.warn('Error reading testimonials from Firestore:', e);
    }
  }
  res.json({ testimonials: testimonialsStore });
});

app.post('/api/testimonials', async (req: Request, res: Response) => {
  const { studentName, cohortTrack, currentRole, quote, projectTitle, projectMetrics, skills } = req.body;
  if (!studentName || !quote || !projectTitle) {
    return res.status(400).json({ error: 'studentName, quote, and projectTitle are required.' });
  }

  const id = `TEST-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();
  const newRecord: TestimonialRecord = {
    id,
    studentName: studentName.trim(),
    cohortTrack: (cohortTrack || 'Full Stack & Systems').trim(),
    currentRole: (currentRole || 'Software Engineer').trim(),
    quote: quote.trim(),
    projectTitle: projectTitle.trim(),
    projectMetrics: (projectMetrics || 'Verified capstone architecture').trim(),
    skills: Array.isArray(skills) ? skills : ['TypeScript', 'Distributed Systems'],
    createdAt: now,
  };

  testimonialsStore.unshift(newRecord);

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'testimonials', id), newRecord);
    } catch (e) {
      console.warn('Error saving testimonial to Firestore:', e);
    }
  }

  res.json({ success: true, testimonial: newRecord });
});

// ==========================================
// GEMINI INTELLIGENCE ENDPOINTS
// ==========================================

// Chatbot
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  if (!checkGeminiKey(res)) return;

  try {
    const { messages, role = 'codagram_advisor', modelPreference } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    let systemInstruction = '';
    let selectedModel = 'gemini-3.8-flash';

    if (role === 'codagram_advisor') {
      systemInstruction = `You are the official Codagram Education Advisor AI at Shubham Kasar's Digital Headquarters in Pune.
Codagram's philosophy: "Education, rebuilt around capability."
Codagram does NOT sell certificates or generic video lectures. It connects:
Student → Learning → Real Projects → Capability → Opportunity → Independence.
Practical business model: Students learn with intense real-world execution, with low registration fees and outcome-aligned incentives.
Never make legally absolute guarantees like "guaranteed job". Emphasize capability, true work readiness, and direct connection to hiring partners.
Tone: Direct, encouraging, honest, clear, no corporate fluff, grounded in engineering craftsmanship.`;
      selectedModel = modelPreference === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';
    } else if (role === 'shunya_philosopher') {
      systemInstruction = `You are the philosophical companion exploring the ideas of the book "Shunya" authored by Shubham Kasar.
Core concepts:
- "What remains when there is nothing left to prove?"
- "You are not searching for the self. The self is searching through you."
- "Freedom begins when you stop trying to become someone."
- "Build everything. Depend on nothing."
- "Achieve without becoming."
- "Do your work with shiddat and samarpan, without making money the object of your existence."
Tone: Meditative, reflective, gentle, probing, deeply respectful. Never act as a religious preacher or guru. Frame ideas as direct inquiries into awareness, expectation, fear, desire, and presence.`;
      selectedModel = modelPreference === 'complex' ? 'gemini-4-argon' : 'gemini-3.8-flash';
    } else {
      systemInstruction = `You are the official digital assistant of Shubham Kasar + Codagram.
Help visitors navigate Shubham's founder journey, Codagram learning tracks, Shunya book inquiries, talent hiring for companies, and speaking/press inquiries.
Be concise, clear, and authentic. Never hallucinate fake awards or fake numbers.`;
      selectedModel = 'gemini-3.1-flash-lite';
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: role === 'shunya_philosopher' ? 0.8 : 0.6,
      },
    });

    res.json({
      reply: response.text || 'I could not generate a response. Please try again.',
      model: selectedModel,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Internal error processing chat' });
  }
});

// Search Grounding with gemini-3.8-flash
app.post('/api/gemini/search', async (req: Request, res: Response) => {
  if (!checkGeminiKey(res)) return;

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: 'You are a search-grounded intelligence agent for Codagram. Provide accurate, up-to-date information citing sources and real-time facts.',
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    res.json({
      text: response.text,
      groundingMetadata: groundingMetadata || null,
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Search grounding error:', error);
    res.status(500).json({ error: error.message || 'Error executing search grounding' });
  }
});

// Maps Grounding with gemini-3.8-flash
app.post('/api/gemini/maps', async (req: Request, res: Response) => {
  if (!checkGeminiKey(res)) return;

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        systemInstruction: 'You are a geographical and ecosystem intelligence agent for Codagram in Pune and broader tech hubs. Provide precise location context, tech corridors, campus proximity, and transit intelligence.',
      },
    });

    res.json({
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata || null,
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Maps grounding error:', error);
    res.status(500).json({ error: error.message || 'Error executing maps grounding' });
  }
});

// High Thinking with gemini-4-argon
app.post('/api/gemini/think', async (req: Request, res: Response) => {
  if (!checkGeminiKey(res)) return;

  try {
    const { query, domain } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: query,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        systemInstruction: `You are the Deep Analytical Engine for Shubham Kasar's ecosystem (${domain || 'Philosophy & High-Performance Engineering'}).
Engage deep, first-principles reasoning. Dissect assumptions, explore multi-layered implications, avoid clichés, and deliver a masterwork synthesis.`,
      },
    });

    res.json({
      analysis: response.text,
      model: 'gemini-4-argon',
      thinkingMode: 'HIGH',
    });
  } catch (error: any) {
    console.error('High thinking error:', error);
    try {
      const fallback = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: req.body.query,
      });
      return res.json({
        analysis: fallback.text,
        model: 'gemini-3.8-flash (fallback)',
        thinkingMode: 'Standard High Reasoning',
      });
    } catch (fbErr: any) {
      res.status(500).json({ error: error.message || 'Error executing deep thinking' });
    }
  }
});

// Image Generation with gemini-3-pro-image-preview
app.post('/api/gemini/generate-image', async (req: Request, res: Response) => {
  if (!checkGeminiKey(res)) return;

  try {
    const { prompt, size = '1K', aspectRatio = '1:1' } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(size) ? size : '1K';
    let imageBase64 = '';
    let usedModel = 'gemini-3-pro-image-preview';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || '1:1',
            imageSize: chosenSize,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
          break;
        }
      }
    } catch (primaryErr) {
      console.warn('gemini-3-pro-image-preview fallback, trying gemini-3.1-flash-lite-image:', primaryErr);
      usedModel = 'gemini-3.1-flash-lite-image';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });
      for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: 'No image data returned from model' });
    }

    res.json({
      imageUrl: `data:image/png;base64,${imageBase64}`,
      model: usedModel,
      size: chosenSize,
      aspectRatio,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

// Science APIs
app.get('/api/science/protein/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim().toUpperCase();

    const uniprotUrl = `https://rest.uniprot.org/uniprotkb/${cleanId}.json`;
    const uniprotRes = await fetch(uniprotUrl);
    if (!uniprotRes.ok) {
      return res.status(uniprotRes.status).json({ error: `UniProt ID ${cleanId} not found` });
    }
    const data = await uniprotRes.json();

    let alphafoldData = null;
    try {
      const afRes = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${cleanId}`);
      if (afRes.ok) {
        const afJson = await afRes.json();
        alphafoldData = afJson[0] || null;
      }
    } catch (e) {
      console.warn('AlphaFold fetch warning:', e);
    }

    const proteinInfo = {
      accession: data.primaryAccession,
      name: data.proteinDescription?.recommendedName?.fullName?.value || data.uniProtkbId,
      gene: data.genes?.[0]?.geneName?.value || 'N/A',
      organism: data.organism?.scientificName || 'Homo sapiens',
      sequenceLength: data.sequence?.length || 0,
      sequence: data.sequence?.value ? data.sequence.value.slice(0, 150) + '...' : '',
      functionSummary: data.comments?.find((c: any) => c.commentType === 'FUNCTION')?.texts?.[0]?.value || 'Structural or regulatory cellular component.',
      subcellularLocation: data.comments?.find((c: any) => c.commentType === 'SUBCELLULAR LOCATION')?.subcellularLocations?.[0]?.location?.value || 'Cellular',
      alphafold: alphafoldData ? {
        pdbUrl: alphafoldData.pdbUrl,
        cifUrl: alphafoldData.cifUrl,
        paeDocUrl: alphafoldData.paeDocUrl,
        globalMetricValue: alphafoldData.globalMetricValue,
      } : null,
    };

    res.json(proteinInfo);
  } catch (error: any) {
    console.error('Protein fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch protein details' });
  }
});

app.get('/api/science/literature', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || 'computational biology machine learning protein folding';
    const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=6`;
    const searchRes = await fetch(esearchUrl);
    const searchData = await searchRes.json();
    const idList = searchData.esearchresult?.idlist || [];

    if (idList.length === 0) {
      return res.json({ articles: [] });
    }

    const esummaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`;
    const sumRes = await fetch(esummaryUrl);
    const sumData = await sumRes.json();

    const articles = idList.map((id: string) => {
      const item = sumData.result?.[id] || {};
      return {
        pmid: id,
        title: item.title || 'Untitled Research Article',
        source: item.source || 'Journal',
        pubdate: item.pubdate || 'Recent',
        authors: (item.authors || []).map((a: any) => a.name).slice(0, 3).join(', '),
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      };
    });

    res.json({ articles });
  } catch (error: any) {
    console.error('Literature fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch literature' });
  }
});

// Vite or static hosting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Headquarters running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
