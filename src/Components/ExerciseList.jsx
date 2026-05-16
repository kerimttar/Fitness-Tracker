// ============================================================
// Components/ExerciseList.jsx
// Egzersizleri listeler; düzenleme ve silme işlemleri (READ + DELETE)
// ============================================================

import React, { useState } from "react";

const CATEGORY_COLORS = {
  "Güç": "bg-blue-900/50 text-blue-300 border-blue-700",
  "Kardiyo": "bg-orange-900/50 text-orange-300 border-orange-700",
  "Esneklik": "bg-purple-900/50 text-purple-300 border-purple-700",
  "HIIT": "bg-red-900/50 text-red-300 border-red-700",
  "Diğer": "bg-gray-700/60 text-gray-300 border-gray-600",
};

const CATEGORY_ICONS = {
  "Güç": "🏋️",
  "Kardiyo": "🏃",
  "Esneklik": "🧘",
  "HIIT": "⚡",
  "Diğer": "💪",
};

/**
 * @param {Object}    props
 * @param {Array}     props.exercises      - Tüm egzersiz kayıtları
 * @param {Function}  props.onEdit         - (exercise) => void
 * @param {Function}  props.onDelete       - (id) => void
 */
export default function ExerciseList({ exercises, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);

  function handleDeleteClick(id) {
    setConfirmId(id);
  }

  function handleConfirmDelete() {
    if (confirmId) {
      onDelete(confirmId);
      setConfirmId(null);
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">🏟️</p>
        <p className="text-gray-400 text-sm">Henüz egzersiz eklenmedi.</p>
        <p className="text-gray-600 text-xs mt-1">Soldaki formdan ilk egzersizini ekle!</p>
      </div>
    );
  }

  // Toplam istatistikler
  const totalCalories = exercises.reduce((s, e) => s + (e.caloriesBurned || 0), 0);
  const totalDuration = exercises.reduce((s, e) => s + (e.duration || 0), 0);

  return (
    <div className="space-y-3">
      {/* Özet bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 flex items-center justify-between">
        <span className="text-gray-400 text-xs">{exercises.length} egzersiz</span>
        <div className="flex gap-4">
          <span className="text-xs text-orange-400">🔥 {totalCalories} kcal</span>
          <span className="text-xs text-blue-400">⏱ {totalDuration} dk</span>
        </div>
      </div>

      {/* Kartlar */}
      {exercises.map((ex) => (
        <div
          key={ex.id}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-4 
                     hover:border-gray-500 transition-colors group"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Sol: bilgiler */}
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-2xl mt-0.5 flex-shrink-0">
                {CATEGORY_ICONS[ex.category] || "💪"}
              </span>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{ex.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      CATEGORY_COLORS[ex.category] || CATEGORY_COLORS["Diğer"]
                    }`}
                  >
                    {ex.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                    {ex.sets} set × {ex.reps} tekrar
                  </span>
                  {ex.weight > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                      {ex.weight} kg
                    </span>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  {ex.duration > 0 && (
                    <span className="text-xs text-blue-400">⏱ {ex.duration} dk</span>
                  )}
                  {ex.caloriesBurned > 0 && (
                    <span className="text-xs text-orange-400">🔥 {ex.caloriesBurned} kcal</span>
                  )}
                </div>

                {ex.notes && (
                  <p className="text-xs text-gray-500 mt-1.5 italic">"{ex.notes}"</p>
                )}
              </div>
            </div>

            {/* Sağ: aksiyonlar */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => onEdit(ex)}
                title="Düzenle"
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-blue-700 
                           text-gray-400 hover:text-white transition-colors text-xs"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteClick(ex.id)}
                title="Sil"
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-red-700 
                           text-gray-400 hover:text-red-300 transition-colors text-xs"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Silme onayı */}
          {confirmId === ex.id && (
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
              <p className="text-xs text-red-400">Bu egzersizi silmek istediğinden emin misin?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmDelete}
                  className="text-xs px-3 py-1 rounded-lg bg-red-700 hover:bg-red-600 
                             text-white transition-colors"
                >
                  Evet, Sil
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="text-xs px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 
                             text-gray-300 transition-colors"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
