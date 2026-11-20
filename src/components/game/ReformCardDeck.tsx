import React, { useState } from 'react';
import { CardCategory, DecisionCard } from '../../types';
import { HandDrawnFrame } from '../HandDrawnFrame';
import { Check, Layers } from 'lucide-react';

interface ReformCardDeckProps {
  cards: DecisionCard[];
  playedCardIds: string[];
  politicalCapital: number;
  onPlayCard: (card: DecisionCard) => void;
}

const FILTER_TABS: { id: 'all' | CardCategory; label: string }[] = [
  { id: 'all', label: 'Alle Karten' },
  { id: 'generation_capital', label: 'Aktienfonds' },
  { id: 'macro', label: 'Systemreform' },
  { id: 'life', label: 'Vorsorge' },
];

export const ReformCardDeck: React.FC<ReformCardDeckProps> = ({
  cards,
  playedCardIds,
  politicalCapital,
  onPlayCard,
}) => {
  const [filter, setFilter] = useState<'all' | CardCategory>('all');

  const visibleCards =
    filter === 'all' ? cards : cards.filter((c) => c.category === filter);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Strategische Reformkarten</span>
          </h3>
          <p className="text-xs text-[#86868b] mt-0.5">
            Dauerhafte Gesetzespakete gegen den demografischen Druck ({playedCardIds.length} von{' '}
            {cards.length} verankert).
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#161617] rounded-xl border border-white/10 w-fit overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-black font-semibold'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCards.map((card) => {
          const isPlayed = playedCardIds.includes(card.id);
          const canAfford = politicalCapital >= card.politicalCapitalCost;

          return (
            <div
              key={card.id}
              className={`rounded-2xl apple-glass-card border transition-colors flex flex-col justify-between overflow-hidden ${
                isPlayed
                  ? 'border-amber-400/60 bg-amber-400/5'
                  : canAfford
                  ? 'border-white/10 hover:border-white/25'
                  : 'border-white/5 opacity-65'
              }`}
            >
              <div>
                <HandDrawnFrame
                  assetPath={card.artworkAssetPath}
                  title={card.title}
                  designerInstruction={card.designerNotes}
                  dimensions={card.dimensions}
                  heightClass="h-32"
                  className="rounded-none border-0 border-b border-white/10"
                />

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white tracking-tight">
                      {card.title}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-amber-400 shrink-0 tabular-nums">
                      {card.politicalCapitalCost} Kapital
                    </span>
                  </div>
                  <div className="text-xs text-amber-400/90 font-medium">{card.subtitle}</div>
                  <p className="text-xs text-[#86868b] leading-relaxed">{card.description}</p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <button
                  disabled={isPlayed || !canAfford}
                  onClick={() => onPlayCard(card)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    isPlayed
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 cursor-default'
                      : canAfford
                      ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer'
                      : 'bg-white/5 text-red-400/70 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  {isPlayed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Aktiv im Gesetzblatt</span>
                    </>
                  ) : canAfford ? (
                    <span>Verabschieden ({card.politicalCapitalCost} Kapital)</span>
                  ) : (
                    <span>Zu wenig Kapital ({card.politicalCapitalCost})</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
