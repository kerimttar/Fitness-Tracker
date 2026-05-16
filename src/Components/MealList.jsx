// ============================================================
// Components/MealList.jsx
// Öğünleri listeler; düzenleme ve silme işlemleri (READ + DELETE)
// ============================================================

import React, { useState } from "react";

const MEAL_TYPE_COLORS = {
  "Kahvaltı": "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  "Öğle": "bg-orange-900/50 text-orange-300 border-orange-700",
  "Akşam": "bg-indigo-900/50 text-indigo-300 border-indigo-700",
  "Ara Öğün": "bg-teal-900/50 text-teal-300 border-teal-700",
};

const MEAL_TYPE_ICONS = {
  "Kahvaltı": "🌅",
  "Öğle": "☀️",
  "Akşam": "🌙",
  "Ara Öğün": "🍎",
};

/**
 * @param {Object}    props
 * @param {Array}     props.meals
 * @param {Function}  props.onEdit    - (meal) => void
 * @param {Function}  props.onDelete  - (id) => void
 */
export default function MealList({ meals, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);

  if (meals.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
        <p className="text-4xl mb-3">🍽️</p>
        <p className="text-gray-400 text-sm">Henüz öğün eklenmedi.</p>
        <p className="text-gray-600 text-xs mt-1">Soldaki formdan ilk öğününü ekle!</p>
      </div>
    );
  }

  const totalCals = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);

  return (
    <div className="space-y-3">
      {/* Makro özeti */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
        <div className="flex flex-wrap gap-3 justify-between">
          <span className="text-xs text-rose-400 font-semibold">
            🔥 {totalCals.toLocaleString("tr-TR")} kcal
          </span>
          <span className="text-xs text-blue-400">🥩 P: {totalProtein.toFixed(1)}g</span>
          <span className="text-xs text-yellow-400">🌾 K: {totalCarbs.toFixed(1)}g</span>
          <span className="text-xs text-orange-400">🫒 Y: {totalFat.toFixed(1)}g</span>
        </div>
      </div>

      {/* Öğün kartları */}
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-4 
                     hover:border-gray-500 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Sol */}
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-2xl mt-0.5 flex-shrink-0">
                {MEAL_TYPE_ICONS[meal.mealType] || "🍴"}
              </span>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{meal.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      MEAL_TYPE_COLORS[meal.mealType] || "bg-gray-700 text-gray-300 border-gray-600"
                    }`}
                  >
                    {meal.mealType}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/40 text-rose-300 border border-rose-700">
                    🔥 {meal.calories} kcal
                  </span>
                </div>

                {/* Makrolar */}
                {(meal.protein > 0 || meal.carbs > 0 || meal.fat > 0) && (
                  <div className="flex gap-3 mt-2">
                    {meal.protein > 0 && (
                      <span className="text-xs text-blue-400">P: {meal.protein}g</span>
                    )}
                    {meal.carbs > 0 && (
                      <span className="text-xs text-yellow-400">K: {meal.carbs}g</span>
                    )}
                    {meal.fat > 0 && (
                      <span className="text-xs text-orange-400">Y: {meal.fat}g</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sağ: aksiyonlar */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => onEdit(meal)}
                title="Düzenle"
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-blue-700 
                           text-gray-400 hover:text-white transition-colors text-xs"
              >
                ✏️
              </button>
              <button
                onClick={() => setConfirmId(meal.id)}
                title="Sil"
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-red-700 
                           text-gray-400 hover:text-red-300 transition-colors text-xs"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Silme onayı */}
          {confirmId === meal.id && (
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
              <p className="text-xs text-red-400">Bu öğünü silmek istediğinden emin misin?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { onDelete(meal.id); setConfirmId(null); }}
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
