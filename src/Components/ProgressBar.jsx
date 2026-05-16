// ============================================================
// Components/ProgressBar.jsx
// Günlük hedef ilerleme çubuğu bileşeni
// ============================================================

import React from "react";

/**
 * @param {Object}  props
 * @param {string}  props.label       - Çubuk başlığı
 * @param {number}  props.current     - Mevcut değer
 * @param {number}  props.goal        - Hedef değer
 * @param {string}  props.unit        - Birim (kcal, g, dk …)
 * @param {string}  props.colorClass  - Tailwind arka plan renk sınıfı
 * @param {string}  props.icon        - Emoji / ikon
 */
export default function ProgressBar({ label, current, goal, unit, colorClass, icon }) {
  const pct = goal > 0 ? Math.min(Math.round((current / goal) * 100), 100) : 0;
  const isOver = current > goal;

  return (
    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 hover:border-gray-500 transition-colors">
      {/* Üst satır: ikon + başlık + yüzde */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-gray-300 text-sm font-medium">{label}</span>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isOver
              ? "bg-red-900/60 text-red-300"
              : pct >= 100
              ? "bg-green-900/60 text-green-300"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {pct}%
        </span>
      </div>

      {/* İlerleme çubuğu */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
            isOver ? "bg-red-500" : colorClass
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Alt satır: mevcut / hedef */}
      <div className="flex justify-between mt-2">
        <span className={`text-sm font-bold ${isOver ? "text-red-400" : "text-white"}`}>
          {current.toLocaleString("tr-TR")} {unit}
        </span>
        <span className="text-xs text-gray-500">
          Hedef: {goal.toLocaleString("tr-TR")} {unit}
        </span>
      </div>

      {/* Tamamlandı mesajı */}
      {pct >= 100 && !isOver && (
        <p className="text-xs text-green-400 mt-1 font-medium">✓ Hedefe ulaşıldı!</p>
      )}
      {isOver && (
        <p className="text-xs text-red-400 mt-1 font-medium">⚠ Hedef aşıldı!</p>
      )}
    </div>
  );
}
