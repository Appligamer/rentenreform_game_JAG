import React from 'react';
import { DIFFICULTY_CONFIGS } from '../simulation/difficultyConfig';
import { DifficultyLevel } from '../types';
import { AlertTriangle, Heart, ShieldCheck, Trophy, Zap } from 'lucide-react';

export const RulesMissionView: React.FC = () => {
  const levels: DifficultyLevel[] = ['normal', 'hard', 'hardcore'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#86868b] mb-1 font-mono">
          <span>Bundeswettbewerb econo=me</span>
          <span aria-hidden="true">·</span>
          <span>Rente gut, alles gut?</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white text-balance">
          Mission & Spielregeln: Generation Zukunft
        </h1>
        <p className="text-sm text-[#86868b] mt-1.5 leading-relaxed">
          Steuere die deutsche Rentenversicherung von 2026 bis 2045 durch den Ruhestand der
          Babyboomer-Jahrgänge. Halte Beitragssatz, Rentenniveau und Staatskasse im Gleichgewicht.
        </p>
      </div>

      {/* 3 Verlustbedingungen */}
      <section className="p-6 rounded-2xl apple-glass space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Verlustbedingungen (Game Over)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Zap className="w-4 h-4" />
              <span>1. Generalstreik der Jugend</span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Übersteigt der Beitragssatz die Modus-Grenze (z. B.{' '}
              <strong className="text-white">22,3 %</strong> im Modus Schwer) oder sinkt die
              Zufriedenheit der Erwerbstätigen auf 0 %, bricht die Finanzierung zusammen.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <Heart className="w-4 h-4" />
              <span>2. Altersarmut-Revolte</span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Fällt das Rentenniveau unter die Schutzgrenze (<strong className="text-white">46,8 %</strong>{' '}
              im Modus Schwer) oder sinkt das Vertrauen der Senioren auf 0 %, droht Altersarmut.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Kassen-Insolvenz</span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Schmilzt die Nachhaltigkeitsrücklage auf <strong className="text-white">0,00 Monate</strong>,
              kann die Rentenkasse laufende Auszahlungen nicht mehr bedienen.
            </p>
          </div>
        </div>
      </section>

      {/* Schwierigkeitsgrade im Überblick */}
      <section className="p-6 rounded-2xl apple-glass space-y-4">
        <h2 className="text-base font-bold text-white">Schwierigkeitsgrade & Balance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((lvl) => {
            const c = DIFFICULTY_CONFIGS[lvl];
            return (
              <div key={lvl} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-sm font-bold text-amber-400">{c.label}</div>
                <p className="text-xs text-[#86868b] leading-relaxed">{c.shortDescription}</p>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-[#a1a1a6] space-y-1 tabular-nums">
                  <div>Start-Kapital: {c.startingPoliticalCapital} Punkte</div>
                  <div>Beitrag max.: {c.maxContributionRate.toFixed(1)} %</div>
                  <div>Niveau min.: {c.minPensionLevel.toFixed(1)} %</div>
                  <div>Marktschocks: {Object.keys(c.marketShocks).length} Krisenjahre</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Siegbedingung */}
      <section className="p-6 rounded-2xl apple-glass space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Siegbedingung (Jahr 2045 erreichen)</span>
        </h2>
        <p className="text-xs text-[#86868b] leading-relaxed">
          Wer das Jahr 2045 erreicht, meistert den demografischen Flaschenhals. Für die{' '}
          <strong className="text-amber-400">Gold-Auszeichnung</strong> müssen bis 2045 ein
          Beitragssatz unter 21,2 %, ein Generationenkapital von über 180 Mrd. €, ein Rentenniveau
          von mind. 47,5 % und eine durchschnittliche Zufriedenheit ab 55 % erreicht werden.
        </p>
      </section>
    </div>
  );
};
