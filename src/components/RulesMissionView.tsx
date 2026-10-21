import React from 'react';
import { Trophy, ShieldCheck, AlertTriangle, Coins, Users, Heart, Zap, Sparkles } from 'lucide-react';

export const RulesMissionView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#86868b] mb-1 font-mono">
          <span>Bundeswettbewerb econo=me 2024/2025</span>
          <span>·</span>
          <span>Aufgabe: Rente gut, alles gut?</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Mission & Spielregeln: Generation Zukunft
        </h1>
        <p className="text-sm text-[#86868b] mt-1 leading-relaxed">
          Willkommen im Maschinenraum der deutschen Altersvorsorge! Als Chef-Ökonom(in)
          stehst du vor der größten sozioökonomischen Herausforderung der Nachkriegszeit:
          Der Verrentung der Babyboomer-Generation.
        </p>
      </div>

      {/* 3 Game Over Schwellen */}
      <div className="p-6 rounded-3xl apple-glass shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Verlustbedingungen (Game Over Kriterien)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Zap className="w-4 h-4" />
              <span>1. Generalstreik der Jugend</span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Steigt der Beitragssatz auf über <strong className="text-white">22,8 %</strong>,
              bricht die Zufriedenheit der jungen Generation auf 0 % ein. Folge: Brain-Drain,
              Streiks und Abbruch der Simulation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <Heart className="w-4 h-4" />
              <span>2. Altersarmut-Revolte</span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Fällt das gesetzliche Rentenniveau unter <strong className="text-white">46,5 %</strong> oder
              wird das Rentenalter zu abrupt angehoben, verarmen Millionen Senioren.
              Folge: Massenproteste und Abwahl.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Rentenkassen-Bankrott</span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Schmilzt die Nachhaltigkeitsrücklage auf <strong className="text-white">0 Monate</strong>,
              ist die Rentenkasse zahlungsunfähig. Der Bundeshaushalt muss unter
              Zwangskuratel gestellt werden.
            </p>
          </div>
        </div>
      </div>

      {/* Siegesbedingungen & Reformpaket II */}
      <div className="p-6 rounded-3xl apple-glass shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Siegbedingung (Die econo=me Auszeichnung)</span>
        </h2>
        <p className="text-xs text-[#86868b] leading-relaxed">
          Überstehe die Kampagne bis ins <strong className="text-white">Jahr 2045</strong>, wenn die geburtenstarken
          Jahrgänge den Scheitelpunkt überschritten haben. Wer folgende Ziele erreicht,
          gewinnt die goldene Urkunde:
        </p>

        <ul className="space-y-2 text-xs text-[#86868b] font-mono">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>Haltelinie von mind. 48,0 % bis mindestens 2039 verteidigt</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>Generationenkapital erfolgreich auf &gt;200 Mrd. € aufgebaut</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
            <span>Beitragssatz durch Kapitalmarkterträge unter 21,8 % gedämpft</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            <span>Zufriedenheit bei Jugend und Senioren über 40 % gehalten</span>
          </li>
        </ul>
      </div>

      {/* Die mathematische Realität */}
      <div className="p-6 rounded-3xl bg-[#161617] border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white">
          Die ökonomische Realität: Warum das Spiel so spannend ist
        </h3>
        <p className="text-xs text-[#86868b] leading-relaxed">
          In Deutschland basiert die gesetzliche Rente auf dem <strong className="text-white">Umlageverfahren</strong>:
          Die heutigen Beitragszahler finanzieren die heutigen Rentner direkt im selben Monat.
          1962 kamen auf einen Rentner noch 6 Erwerbstätige. 2024 sind es nur noch 2,1.
          Bis 2038 sinkt das Verhältnis auf fast 1,4 zu 1. Ohne das neue <strong className="text-white">Rentenpaket II</strong> und
          die Erträge des <strong className="text-white">Generationenkapitals (Aktienrente)</strong> müsste der Beitragssatz
          auf über 23 % steigen oder die Renten drastisch gekürzt werden. Finde den richtigen Pfad!
        </p>
      </div>
    </div>
  );
};
