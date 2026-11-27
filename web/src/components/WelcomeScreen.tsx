import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Coins,
  Heart,
  Play,
  Shield,
  Trash2,
  Trophy,
  Zap,
} from 'lucide-react';
import { SavedRunScore } from '../utils/scoreHistory';
import { hapticEngine } from '../utils/haptics';

interface WelcomeScreenProps {
  scores: SavedRunScore[];
  onStartGame: () => void;
  onClearScores: () => void;
}

interface TutorialStep {
  title: string;
  subtitle: string;
  summary: string;
  points: { label: string; detail: string; colorClass: string }[];
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '1. Dein Ziel: Deutschland sicher bis 2045 steuern',
    subtitle: 'Du übernimmst die Verantwortung für die gesetzliche Rente.',
    summary:
      'Zwischen 2026 und 2045 gehen Millionen Babyboomer in den Ruhestand. Jedes Jahr stellst du dich einer politischen Entscheidung, bis du das Zieljahr 2045 erreichst.',
    points: [
      {
        label: '1 Runde = 1 Jahr',
        detail: 'Jede Entscheidung im Jahres-Dilemma bewegt die Simulation um ein Jahr weiter (2026 bis 2045).',
        colorClass: 'text-amber-400',
      },
      {
        label: 'Drei Grenzen beachten',
        detail:
          'Wenn der Beitragssatz zu hoch steigt, das Rentenniveau zu stark fällt oder die Rücklage auf 0,00 Monate sinkt, ist das Spiel vorbei.',
        colorClass: 'text-rose-400',
      },
      {
        label: 'Sieg bei 2045',
        detail:
          'Erreichst du das Jahr 2045 innerhalb des Korridors, gewinnst du die Kampagne und sicherst dir Bronze, Silber oder Gold.',
        colorClass: 'text-emerald-400',
      },
    ],
  },
  {
    title: '2. Die 4 Ringe einfach erklärt',
    subtitle: 'Diese vier Anzeigen zeigen dir jederzeit, ob alles im Lot ist.',
    summary:
      'Oben auf dem Spielfeld siehst du vier große Ringe. Bleiben alle im grünen oder gelben Bereich, läuft das System stabil.',
    points: [
      {
        label: 'Jugend & Zahler (Beitragssatz)',
        detail: 'Steigt der Rentenbeitrag zu stark, sinkt die Zufriedenheit der jungen Erwerbstätigen.',
        colorClass: 'text-amber-400',
      },
      {
        label: 'Senioren & Rentner (Rentenniveau)',
        detail: 'Sinkt die Rente im Verhältnis zum Lohn unter das Minimum, droht Altersarmut.',
        colorClass: 'text-rose-400',
      },
      {
        label: 'Rentenrücklage & Generationenkapital',
        detail:
          'Die Rücklage ist dein Geldpuffer in Monaten. Das Generationenkapital ist der Aktienfonds, der ab 2035 die Rente spürbar entlastet.',
        colorClass: 'text-sky-400',
      },
    ],
  },
  {
    title: '3. So spielst du jede Runde',
    subtitle: 'Dilemma wählen, Reformkarten nutzen, Kapital einteilen.',
    summary:
      'Du musst nicht raten — vor jeder Aktion steht genau dabei, wie sie sich auf Beitrag, Rente, Fonds und Politisches Kapital auswirkt.',
    points: [
      {
        label: 'Jahres-Dilemma (Mitte)',
        detail:
          'Wähle eine von mehreren Antworten für das aktuelle Jahr. Eine Option ist immer kostenlos, stärkere Optionen kosten Politisches Kapital.',
        colorClass: 'text-amber-400',
      },
      {
        label: 'Reformkarten (Unten)',
        detail:
          'Einmalige Gesetze (z. B. Aktienrente ausbauen oder Fachkräfte anwerben). Sie wirken dauerhaft für den gesamten Rest des Spiels.',
        colorClass: 'text-emerald-400',
      },
      {
        label: 'Schwierigkeitsgrad (Oben rechts)',
        detail:
          'Im regulären Spiel startet „Schwer“. Zum Kennenlernen kannst du oben rechts jederzeit auf „Normal“ wechseln.',
        colorClass: 'text-sky-400',
      },
    ],
  },
  {
    title: '4. Drei einfache Tipps für deinen ersten Sieg',
    subtitle: 'Damit kommst du sofort stark durch die Babyboomer-Welle.',
    summary:
      'Mit dieser kurzen Faustregel bist du optimal auf das reguläre Spiel vorbereitet:',
    points: [
      {
        label: 'Tipp 1: Früh ins Generationenkapital investieren',
        detail:
          'Je früher der Fonds wächst, desto mehr Zinseszins arbeitet für dich und dämpft ab 2035 den Beitragssatz automatisch.',
        colorClass: 'text-emerald-400',
      },
      {
        label: 'Tipp 2: Politisches Kapital für Krisen aufsparen',
        detail:
          'In Krisenjahren (z. B. Börsencrash) brauchst du Kapitalreserven, um Gegenmaßnahmen zu finanzieren.',
        colorClass: 'text-amber-400',
      },
      {
        label: 'Tipp 3: Immer beide Seiten im Blick behalten',
        detail:
          'Entlaste nicht nur eine Gruppe — stabile Beiträge für Junge und faires Niveau für Ältere gewinnen gemeinsam.',
        colorClass: 'text-sky-400',
      },
    ],
  },
];

function formatRunDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function getDifficultyLabel(diff: SavedRunScore['difficulty']): string {
  if (diff === 'hardcore') return 'Hardcore';
  if (diff === 'hard') return 'Schwer';
  return 'Normal';
}

function getStatusText(entry: SavedRunScore): { label: string; colorClass: string } {
  if (entry.status === 'victory') {
    const tier =
      entry.awardTier === 'gold'
        ? 'Gold'
        : entry.awardTier === 'silver'
        ? 'Silber'
        : 'Bronze';
    return { label: `Sieg 2045 · ${tier}`, colorClass: 'text-emerald-400' };
  }
  if (entry.status === 'game_over') {
    return { label: `Gescheitert (${entry.year})`, colorClass: 'text-rose-400' };
  }
  return { label: `Stand Jahr ${entry.year}`, colorClass: 'text-amber-400' };
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  scores,
  onStartGame,
  onClearScores,
}) => {
  const [mode, setMode] = useState<'landing' | 'tutorial'>('landing');
  const [tutorialStep, setTutorialStep] = useState<number>(0);

  const bestScore = scores.reduce((max, s) => (s.score > max ? s.score : max), 0);
  const victoryCount = scores.filter((s) => s.status === 'victory').length;

  if (mode === 'tutorial') {
    const step = TUTORIAL_STEPS[tutorialStep];
    const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;

    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-6">
        <div className="w-full max-w-3xl p-6 sm:p-8 rounded-2xl apple-glass space-y-6">
          {/* Kopfbereich Tutorial */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#86868b] tabular-nums">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-white font-semibold">
                Schnell-Tutorial · Schritt {tutorialStep + 1} von {TUTORIAL_STEPS.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                hapticEngine.medium();
                onStartGame();
              }}
              className="text-xs text-[#86868b] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Überspringen &amp; direkt starten →
            </button>
          </div>

          {/* Fortschrittsbalken */}
          <div className="grid grid-cols-4 gap-2" aria-hidden="true">
            {TUTORIAL_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-colors ${
                  idx <= tutorialStep ? 'bg-amber-400' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Schritt-Inhalt */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
                {step.title}
              </h2>
              <p className="text-sm text-amber-400 font-medium mt-1">{step.subtitle}</p>
            </div>

            <p className="text-sm text-[#a1a1a6] leading-relaxed">{step.summary}</p>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {step.points.map((pt) => (
                <div
                  key={pt.label}
                  className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1"
                >
                  <div className={`text-sm font-bold ${pt.colorClass}`}>{pt.label}</div>
                  <p className="text-xs text-[#a1a1a6] leading-relaxed">{pt.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fußzeile Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  hapticEngine.selection();
                  if (tutorialStep === 0) {
                    setMode('landing');
                  } else {
                    setTutorialStep((prev) => prev - 1);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{tutorialStep === 0 ? 'Zurück zur Übersicht' : 'Zurück'}</span>
              </button>
            </div>

            {isLast ? (
              <button
                type="button"
                onClick={() => {
                  hapticEngine.medium();
                  onStartGame();
                }}
                className="px-6 py-3 rounded-xl bg-amber-400 text-black text-sm font-extrabold hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Verstanden — Jetzt reguläres Spiel starten!</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  hapticEngine.selection();
                  setTutorialStep((prev) => prev + 1);
                }}
                className="px-6 py-3 rounded-xl bg-amber-400 text-black text-sm font-extrabold hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Weiter zu Schritt {tutorialStep + 2}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-8 space-y-6 max-w-4xl mx-auto">
      {/* Haupt-Begrüßungskarte */}
      <section className="p-6 sm:p-10 rounded-2xl apple-glass space-y-7">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#86868b]">
            <span className="text-amber-400 font-semibold">Generation Zukunft</span>
            <span aria-hidden="true">·</span>
            <span>Bundeswettbewerb econo=me</span>
            <span aria-hidden="true">·</span>
            <span>Rente gut, alles gut?</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
            Willkommen zur Renten-Simulation
          </h1>

          <p className="text-sm sm:text-base text-[#a1a1a6] max-w-2xl leading-relaxed">
            Übernimm die Verantwortung für die deutsche Rentenversicherung von{' '}
            <strong className="text-white">2026 bis 2045</strong>. Halte Beitragssatz, Rentenniveau
            und Staatskasse im Gleichgewicht — wähle jetzt deinen Einstieg:
          </p>
        </div>

        {/* Zwei unübersehbare, idiotensichere Haupt-Auswahlmöglichkeiten */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              hapticEngine.medium();
              onStartGame();
            }}
            className="group p-6 rounded-2xl bg-amber-400 text-black hover:bg-amber-300 transition-all text-left flex flex-col justify-between gap-4 cursor-pointer shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-11 h-11 rounded-xl bg-black/15 flex items-center justify-center">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="space-y-1">
              <div className="text-xl font-extrabold tracking-tight">Direkt starten</div>
              <p className="text-xs font-medium text-black/80 leading-relaxed">
                Sofort ins reguläre Spiel einsteigen und deine erste Jahres-Entscheidung 2026 treffen.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              hapticEngine.light();
              setTutorialStep(0);
              setMode('tutorial');
            }}
            className="group p-6 rounded-2xl bg-black/60 border border-white/15 hover:border-amber-400/50 hover:bg-black/80 text-white transition-all text-left flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <ArrowRight className="w-5 h-5 text-[#86868b] group-hover:text-amber-400 transition-all group-hover:translate-x-1" />
            </div>
            <div className="space-y-1">
              <div className="text-xl font-extrabold tracking-tight">Tutorial machen</div>
              <p className="text-xs text-[#a1a1a6] leading-relaxed">
                4 kurze, kinderleichte Erklärungen zu Ziel, Ringen und Karten — danach direkt loslegen.
              </p>
            </div>
          </button>
        </div>

        {/* Kurzer 4-Punkt-Überblick für sofortiges Verständnis */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-[#a1a1a6]">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Beitragssatz bremsen</span>
          </div>
          <div className="flex items-center gap-2 text-[#a1a1a6]">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Rentenniveau sichern</span>
          </div>
          <div className="flex items-center gap-2 text-[#a1a1a6]">
            <Shield className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Rücklage schützen</span>
          </div>
          <div className="flex items-center gap-2 text-[#a1a1a6]">
            <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Aktienrente aufbauen</span>
          </div>
        </div>
      </section>

      {/* Ehemalige Scores (sichtbar ab dem 2. Start bzw. sobald gespielt wurde) */}
      <section className="p-6 rounded-2xl apple-glass space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Deine bisherigen Scores</h2>
          </div>

          {scores.length > 0 && (
            <button
              type="button"
              onClick={() => {
                hapticEngine.warning();
                onClearScores();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#86868b] hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Verlauf löschen</span>
            </button>
          )}
        </div>

        {scores.length === 0 ? (
          <p className="text-xs text-[#86868b] leading-relaxed">
            Erster Start erkannt — noch keine gespeicherten Durchgänge vorhanden. Sobald du deine
            erste Runde spielst, erscheinen deine ehemaligen Scores ab dem nächsten Start automatisch hier.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs font-mono tabular-nums">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10">
                <div className="text-[#86868b] text-[11px]">Bester Score</div>
                <div className="text-lg font-extrabold text-amber-400 mt-0.5">{bestScore}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10">
                <div className="text-[#86868b] text-[11px]">Durchgänge</div>
                <div className="text-lg font-extrabold text-white mt-0.5">{scores.length}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10">
                <div className="text-[#86868b] text-[11px]">Siege (2045)</div>
                <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{victoryCount}</div>
              </div>
            </div>

            <div className="divide-y divide-white/10 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
              {scores.slice(0, 8).map((entry) => {
                const statusInfo = getStatusText(entry);
                return (
                  <div
                    key={entry.id}
                    className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2 font-semibold">
                        <span className={statusInfo.colorClass}>{statusInfo.label}</span>
                        <span aria-hidden="true" className="text-[#6e6e73]">·</span>
                        <span className="text-white">Modus {getDifficultyLabel(entry.difficulty)}</span>
                        {entry.updatedAt && (
                          <>
                            <span aria-hidden="true" className="text-[#6e6e73]">·</span>
                            <span className="text-[#86868b] font-normal font-mono tabular-nums">
                              {formatRunDate(entry.updatedAt)}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-[#86868b] font-mono tabular-nums">
                        Beitrag {entry.contributionRate.toFixed(1)} % · Rentenniveau{' '}
                        {entry.pensionLevel.toFixed(1)} % · Fonds{' '}
                        {entry.generationCapitalFund.toFixed(0)} Mrd. €
                      </div>
                    </div>

                    <div className="text-left sm:text-right font-mono tabular-nums shrink-0">
                      <span className="text-[11px] text-[#86868b] mr-1.5">Score</span>
                      <strong className="text-base text-amber-400">{entry.score}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
