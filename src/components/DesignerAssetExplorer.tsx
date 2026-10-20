import React, { useState } from 'react';
import { DESIGNER_ASSET_SPECS } from '../data/designerSpecsData';
import { HandDrawnFrame } from './HandDrawnFrame';
import { Copy, Check, Palette, FileText, Download } from 'lucide-react';

export const DesignerAssetExplorer: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAssets =
    filter === 'all'
      ? DESIGNER_ASSET_SPECS
      : DESIGNER_ASSET_SPECS.filter((a) => a.category === filter);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#86868b] mb-1 font-mono">
            <span>Art Direction & Asset-Pipeline</span>
            <span>·</span>
            <span>graphic_designer_briefing.md</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Asset-Katalog für den Illustrator / Grafikdesigner
          </h1>
          <p className="text-sm text-[#86868b] max-w-2xl mt-1">
            Übersicht aller benötigten handgezeichneten Komponenten mit exakten
            Pixel-Maßen, Stimmungen und Design-Anweisungen. Alle Slots verfügen über
            einen automatischen Blueprint-Wireframe, bis die finale Handzeichnung geliefert wird.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#briefing"
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(
                'Siehe graphic_designer_briefing.md im Repository Root für die vollständige Dokumentation.',
                'full_doc'
              );
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{copiedId === 'full_doc' ? 'Kopiert!' : 'Briefing-Link kopieren'}</span>
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#161617] rounded-xl border border-white/10 w-fit overflow-x-auto">
        {[
          { id: 'all', label: 'Alle Komponenten' },
          { id: 'background', label: 'Hintergründe' },
          { id: 'character', label: 'Charaktere' },
          { id: 'card', label: 'Entscheidungskarten' },
          { id: 'badge', label: 'Metrik-Badges' },
          { id: 'award', label: 'Urkunden & Trophäen' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === tab.id
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#86868b] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="p-5 rounded-2xl bg-[#161617] border border-white/10 flex flex-col justify-between"
          >
            <div>
              {/* Visual Blueprint / Hand-Drawn Frame */}
              <HandDrawnFrame
                assetPath={asset.filePath}
                title={asset.title}
                designerInstruction={asset.instruction}
                dimensions={asset.dimensions}
                heightClass="h-44 mb-4"
              />

              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {asset.title}
                </h3>
                <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {asset.dimensions}
                </span>
              </div>

              <div className="text-[11px] text-[#86868b] font-mono mb-3">
                {asset.filePath}
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div>
                  <span className="text-[#86868b]">Format & Alpha: </span>
                  <span className="text-white font-medium">{asset.format}</span>
                </div>
                <div>
                  <span className="text-[#86868b]">Stimmung / Mood: </span>
                  <span className="text-white font-medium">{asset.mood}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-[#86868b] leading-relaxed">
                  <span className="text-white font-semibold block mb-0.5">
                    Zeichen-Anweisung:
                  </span>
                  {asset.instruction}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                copyToClipboard(
                  `Asset: ${asset.title}\nDateipfad: ${asset.filePath}\nMaße: ${asset.dimensions}\nFormat: ${asset.format}\nAnweisung: ${asset.instruction}`,
                  asset.id
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              {copiedId === asset.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Spezifikation kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white/60" />
                  <span>Spezifikation kopieren</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
