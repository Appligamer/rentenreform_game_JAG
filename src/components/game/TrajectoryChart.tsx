import React, { useState } from 'react';
import { DifficultyLevel, MacroState } from '../../types';
import { getDifficultyConfig } from '../../simulation/difficultyConfig';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

interface TrajectoryChartProps {
  history: MacroState[];
  difficulty: DifficultyLevel;
}

export const TrajectoryChart: React.FC<TrajectoryChartProps> = ({ history, difficulty }) => {
  const [showTable, setShowTable] = useState(false);
  const cfg = getDifficultyConfig(difficulty);

  if (history.length < 2) return null;

  const width = 760;
  const height = 200;
  const padLeft = 44;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const minRate = 17.0;
  const maxRate = Math.max(23.5, cfg.maxContributionRate + 0.6);

  const toX = (year: number) =>
    padLeft + ((year - 2026) / (2045 - 2026)) * chartW;
  const toYRate = (rate: number) =>
    padTop + chartH - ((Math.min(maxRate, Math.max(minRate, rate)) - minRate) / (maxRate - minRate)) * chartH;

  const ratePath = history
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toX(pt.year).toFixed(1)} ${toYRate(pt.contributionRate).toFixed(1)}`)
    .join(' ');

  const maxLineY = toYRate(cfg.maxContributionRate);
  const latest = history[history.length - 1];

  return (
    <section className="p-6 rounded-2xl apple-glass space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Langfrist-Verlauf (2026–{latest.year})</span>
          </h3>
          <p className="text-xs text-[#86868b] mt-0.5 tabular-nums">
            Beitragssatz-Pfad vs. Revolte-Grenze ({cfg.maxContributionRate.toFixed(1)} %) ·
            Fondsbestand {latest.generationCapitalFund.toFixed(1)} Mrd. €
          </p>
        </div>

        <button
          onClick={() => setShowTable((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 text-[#f5f5f7] hover:bg-white/10 transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
        >
          <span>{showTable ? 'Tabelle ausblenden' : 'Jahrestabelle anzeigen'}</span>
          {showTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* SVG Verlaufsgraph */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 min-w-[520px] select-none"
          role="img"
          aria-label="Verlauf von Beitragssatz und Grenzwert über die Jahre"
        >
          {/* Horizontale Gitterlinien */}
          {[18, 20, 22].map((val) => {
            const y = toYRate(val);
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#86868b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Max-Beitragssatz Gefahrenlinie */}
          <line
            x1={padLeft}
            y1={maxLineY}
            x2={width - padRight}
            y2={maxLineY}
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="5 4"
          />
          <text
            x={width - padRight}
            y={maxLineY - 5}
            textAnchor="end"
            fill="#f87171"
            fontSize="10"
            fontFamily="monospace"
          >
            Max {cfg.maxContributionRate.toFixed(1)}%
          </text>

          {/* 2035 Auszahlungs-Markierung */}
          <line
            x1={toX(2035)}
            y1={padTop}
            x2={toX(2035)}
            y2={height - padBottom}
            stroke="rgba(16,185,129,0.35)"
            strokeDasharray="3 3"
          />
          <text
            x={toX(2035) + 4}
            y={padTop + 10}
            fill="#34d399"
            fontSize="9"
            fontFamily="monospace"
          >
            2035 Fonds-Auszahlung
          </text>

          {/* Beitragssatz-Kurve */}
          <path
            d={ratePath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Datenpunkte */}
          {history.map((pt) => (
            <circle
              key={pt.year}
              cx={toX(pt.year)}
              cy={toYRate(pt.contributionRate)}
              r={pt.year === latest.year ? 4.5 : 2.5}
              fill={pt.contributionRate > cfg.maxContributionRate - 0.5 ? '#ef4444' : '#f59e0b'}
            />
          ))}

          {/* X-Achse Jahre */}
          {[2026, 2030, 2035, 2040, 2045].map((yr) => (
            <text
              key={yr}
              x={toX(yr)}
              y={height - 8}
              textAnchor="middle"
              fill="#86868b"
              fontSize="10"
              fontFamily="monospace"
            >
              {yr}
            </text>
          ))}
        </svg>
      </div>

      {showTable && (
        <div className="overflow-x-auto pt-2 border-t border-white/10">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead>
              <tr className="border-b border-white/10 text-[#86868b]">
                <th className="py-2 pr-3">Jahr</th>
                <th className="py-2 pr-3">Beitragssatz</th>
                <th className="py-2 pr-3">Rentenniveau</th>
                <th className="py-2 pr-3">Generationenkapital</th>
                <th className="py-2 pr-3">GRV-Auszahlung</th>
                <th className="py-2 pr-3">Altenquotient</th>
                <th className="py-2">Bundeszuschuss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#f5f5f7]">
              {history.map((row) => (
                <tr key={row.year} className="hover:bg-white/5">
                  <td className="py-2 pr-3 font-bold text-white">{row.year}</td>
                  <td
                    className={`py-2 pr-3 ${
                      row.contributionRate > cfg.maxContributionRate - 0.4
                        ? 'text-red-400 font-semibold'
                        : 'text-amber-400'
                    }`}
                  >
                    {row.contributionRate.toFixed(2)} %
                  </td>
                  <td className="py-2 pr-3 text-sky-400">{row.pensionLevel.toFixed(1)} %</td>
                  <td className="py-2 pr-3 text-emerald-400">
                    {row.generationCapitalFund.toFixed(1)} Mrd. €
                  </td>
                  <td className="py-2 pr-3 text-[#a1a1a6]">
                    {row.fundPayoutToGRV.toFixed(1)} Mrd. €
                  </td>
                  <td className="py-2 pr-3">
                    {(row.contributorsCount / row.pensionersCount).toFixed(2)} : 1
                  </td>
                  <td className="py-2 text-[#86868b]">{row.federalSubsidy.toFixed(1)} Mrd. €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
