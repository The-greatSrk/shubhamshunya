import React, { useState, useEffect } from 'react';
import { ProteinData, PubMedArticle } from '../types';
import { Dna, Search, ExternalLink, Activity, BookOpen, Layers, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const ScienceLab: React.FC = () => {
  const exampleProteins = ['TP53', 'EGFR', 'BRCA1', 'INS', 'ALB'];
  const [selectedAccession, setSelectedAccession] = useState<string>('P04637'); // Human TP53 default
  const [activeChip, setActiveChip] = useState<string>('TP53');
  const [proteinData, setProteinData] = useState<ProteinData | null>(null);
  const [loadingProtein, setLoadingProtein] = useState<boolean>(false);
  const [literature, setLiterature] = useState<PubMedArticle[]>([]);
  const [loadingLit, setLoadingLit] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  const accessionMap: Record<string, string> = {
    TP53: 'P04637',
    EGFR: 'P00533',
    BRCA1: 'P38398',
    INS: 'P01308',
    ALB: 'P02768',
  };

  const fetchProtein = async (id: string) => {
    setLoadingProtein(true);
    try {
      const res = await fetch(`/api/science/protein/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProteinData(data);
      }
    } catch (e) {
      console.error('Failed to load protein data:', e);
    } finally {
      setLoadingProtein(false);
    }
  };

  const fetchLiterature = async (query: string) => {
    setLoadingLit(true);
    try {
      const res = await fetch(`/api/science/literature?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setLiterature(data.articles || []);
      }
    } catch (e) {
      console.error('Failed to load literature:', e);
    } finally {
      setLoadingLit(false);
    }
  };

  useEffect(() => {
    fetchProtein(selectedAccession);
    fetchLiterature('computational biology protein folding structural genomics');
  }, [selectedAccession]);

  const handleSelectChip = (gene: string) => {
    setActiveChip(gene);
    const acc = accessionMap[gene] || gene;
    setSelectedAccession(acc);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setActiveChip('');
    setSelectedAccession(customInput.trim());
    fetchLiterature(`${customInput.trim()} structure function biology`);
  };

  return (
    <section id="science" className="py-28 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06] relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
              <Dna className="w-3.5 h-3.5" />
              <span>FRONTIER LAB — BIO-COMPUTING & SCIENTIFIC INTELLIGENCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
              Where Systems Meet Structural Biology.
            </h2>
            <p className="text-base text-neutral-300 font-light leading-relaxed">
              At Codagram, our technological inquiry doesn’t end with web frameworks. We build across the frontier of computational biology, structural prediction (AlphaFold DB), UniProt sequences, and biomedical intelligence.
            </p>
          </div>

          <div className="text-xs font-mono-code text-neutral-400 bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl">
            <span>Powered by DeepMind Science Skills & Public APIs</span>
          </div>
        </div>

        {/* Quick-Try Example Chip Bar (Mandatory Science Skill Standard) */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono-code uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Select Gene / Protein Example:</span>
            </span>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Or enter UniProt ID (e.g. P04637)..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="px-3 py-1.5 text-xs font-mono-code bg-black/50 border border-white/[0.08] rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4af37] w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-mono-code bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Inspect
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {exampleProteins.map((gene) => (
              <button
                key={gene}
                onClick={() => handleSelectChip(gene)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono-code transition-colors flex items-center gap-1.5 ${
                  activeChip === gene
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                <span>{gene}</span>
                <span className="text-[10px] opacity-70">({accessionMap[gene]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Split Structural Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Protein Metadata & AlphaFold Prediction */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] space-y-6 relative">
              {loadingProtein ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-400 font-mono-code text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#d4af37]" />
                  <span>Querying UniProtKB & AlphaFold DB servers...</span>
                </div>
              ) : proteinData ? (
                <>
                  {/* Header badges */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-white/[0.06] text-white">
                          UniProt: {proteinData.accession}
                        </span>
                        <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {proteinData.gene}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                        {proteinData.name}
                      </h3>
                      <p className="text-xs font-mono-code text-neutral-400">
                        Organism: {proteinData.organism} • Length: {proteinData.sequenceLength} amino acids
                      </p>
                    </div>

                    {/* Epistemic Provenance Badge */}
                    <div className="text-right space-y-1">
                      <span className="inline-block text-[10px] font-mono-code uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        [Curated UniProt & AlphaFold DB v4]
                      </span>
                      <div className="text-[10px] font-mono-code text-neutral-500">
                        Subcellular: {proteinData.subcellularLocation}
                      </div>
                    </div>
                  </div>

                  {/* Biological Function Summary */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05] space-y-2">
                    <div className="text-[11px] font-mono-code text-[#d4af37] uppercase tracking-wider">
                      Biological Function & Molecular Role
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                      {proteinData.functionSummary}
                    </p>
                  </div>

                  {/* AlphaFold Confidence Scale & Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="text-neutral-300">AlphaFold Mean pLDDT Confidence</span>
                      <span className="text-[#d4af37] font-bold">
                        {proteinData.alphafold?.globalMetricValue
                          ? `${proteinData.alphafold.globalMetricValue.toFixed(1)} / 100`
                          : 'Available on AlphaFold DB'}
                      </span>
                    </div>

                    {/* Canonical 4-band AlphaFold pLDDT Legend */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-3 w-full rounded-full overflow-hidden flex bg-neutral-900 border border-white/[0.08]">
                        <div className="h-full bg-[#0053D6]" style={{ width: '40%' }} title="Very High (>90)" />
                        <div className="h-full bg-[#65CBF3]" style={{ width: '35%' }} title="Confident (70-90)" />
                        <div className="h-full bg-[#FFDB13]" style={{ width: '15%' }} title="Low (50-70)" />
                        <div className="h-full bg-[#FF7D45]" style={{ width: '10%' }} title="Very Low (<50)" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-code text-neutral-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0053D6]" /> Very High (&gt;90)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#65CBF3]" /> Confident (70–90)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FFDB13]" /> Low (50–70)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FF7D45]" /> Very Low (&lt;50)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sequence Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider">
                      Sequence Snippet (FASTA):
                    </span>
                    <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] font-mono-code text-[11px] text-neutral-300 break-all leading-relaxed">
                      {proteinData.sequence}
                    </div>
                  </div>

                  {/* Authoritative links */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-3 text-xs font-mono-code">
                    <a
                      href={`https://www.uniprot.org/uniprotkb/${proteinData.accession}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white flex items-center gap-1.5"
                    >
                      <span>UniProt Entry</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {proteinData.alphafold?.pdbUrl && (
                      <a
                        href={proteinData.alphafold.pdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d4af37] hover:underline flex items-center gap-1.5"
                      >
                        <span>Download AlphaFold PDB (.pdb)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Biomedical Literature & Research Synthesis (PubMed) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono-code uppercase tracking-widest text-[#d4af37]">
                    NCBI PubMed
                  </span>
                  <h4 className="text-base font-heading font-bold text-white">
                    Related Peer-Reviewed Literature
                  </h4>
                </div>
                <BookOpen className="w-4 h-4 text-neutral-400" />
              </div>

              {loadingLit ? (
                <div className="py-12 flex justify-center text-xs font-mono-code text-neutral-400">
                  <span>Searching PubMed citations...</span>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {literature.slice(0, 4).map((art) => (
                    <a
                      key={art.pmid}
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all group space-y-1.5"
                    >
                      <span className="text-[10px] font-mono-code text-neutral-500 uppercase">
                        PMID: {art.pmid} • {art.pubdate}
                      </span>
                      <h5 className="text-xs font-heading font-semibold text-neutral-200 group-hover:text-white leading-snug">
                        {art.title}
                      </h5>
                      <p className="text-[11px] font-mono-code text-neutral-400 truncate">
                        {art.source} — {art.authors}
                      </p>
                    </a>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono-code text-neutral-500">
                Curated via NCBI E-utilities Entrez Service
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
