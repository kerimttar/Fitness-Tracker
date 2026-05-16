// ============================================================
// Components/ExerciseForm.jsx
// Egzersiz ekleme ve güncelleme formu (CREATE + UPDATE)
// ============================================================

import React, { useState, useEffect } from "react";
import { createExercise, EXERCISE_CATEGORIES } from "../Interfaces/types";

const EMPTY_FORM = {
  name: "",
  category: "Güç",
  sets: "",
  reps: "",
  weight: "",
  duration: "",
  caloriesBurned: "",
  notes: "",
};

/**
 * @param {Object}        props
 * @param {Function}      props.onSave        - (exercise) => void
 * @param {Object|null}   props.editingItem   - Düzenlenen egzersiz; null ise yeni kayıt
 * @param {Function}      props.onCancelEdit  - Düzenlemeyi iptal et
 */
export default function ExerciseForm({ onSave, editingItem, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  // Düzenleme moduna girildiğinde formu doldur
  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name,
        category: editingItem.category,
        sets: String(editingItem.sets),
        reps: String(editingItem.reps),
        weight: String(editingItem.weight),
        duration: String(editingItem.duration),
        caloriesBurned: String(editingItem.caloriesBurned),
        notes: editingItem.notes || "",
      });
      setErrors({});
    } else {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [editingItem]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Kullanıcı yazmaya başlayınca hatayı temizle
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Egzersiz adı boş bırakılamaz.";
    if (form.name.trim().length > 60) newErrors.name = "Ad en fazla 60 karakter olabilir.";

    const numFields = [
      { key: "sets", label: "Set sayısı", min: 1, max: 100, required: true },
      { key: "reps", label: "Tekrar sayısı", min: 1, max: 500, required: true },
      { key: "weight", label: "Ağırlık", min: 0, max: 1000, required: false },
      { key: "duration", label: "Süre", min: 0, max: 600, required: false },
      { key: "caloriesBurned", label: "Yakılan kalori", min: 0, max: 5000, required: false },
    ];

    numFields.forEach(({ key, label, min, max, required }) => {
      const val = form[key];
      if (required && val === "") {
        newErrors[key] = `${label} boş bırakılamaz.`;
      } else if (val !== "") {
        const num = Number(val);
        if (isNaN(num) || !Number.isFinite(num)) {
          newErrors[key] = `${label} geçerli bir sayı olmalıdır.`;
        } else if (num < min) {
          newErrors[key] = `${label} en az ${min} olabilir.`;
        } else if (num > max) {
          newErrors[key] = `${label} en fazla ${max} olabilir.`;
        }
      }
    });

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Titreme animasyonu
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const exercise = createExercise({
      ...(editingItem ? { id: editingItem.id, date: editingItem.date } : {}),
      name: form.name.trim(),
      category: form.category,
      sets: Number(form.sets),
      reps: Number(form.reps),
      weight: form.weight === "" ? 0 : Number(form.weight),
      duration: form.duration === "" ? 0 : Number(form.duration),
      caloriesBurned: form.caloriesBurned === "" ? 0 : Number(form.caloriesBurned),
      notes: form.notes.trim(),
    });

    onSave(exercise);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  const inputClass = (field) =>
    `w-full bg-gray-700 border rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 
     focus:outline-none focus:ring-2 transition-all ${
       errors[field]
         ? "border-red-500 focus:ring-red-500/40"
         : "border-gray-600 focus:ring-emerald-500/40 focus:border-emerald-500"
     }`;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
      <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
        <span className="text-xl">{editingItem ? "✏️" : "🏋️"}</span>
        {editingItem ? "Egzersizi Güncelle" : "Egzersiz Ekle"}
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        className={shake ? "animate-shake" : ""}
      >
        {/* Egzersiz Adı */}
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">
            Egzersiz Adı <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="ör: Bench Press, Koşu…"
            className={inputClass("name")}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Kategori */}
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">Kategori</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass("category")}
          >
            {EXERCISE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Set & Tekrar */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1">
              Set <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="sets"
              value={form.sets}
              onChange={handleChange}
              min="1"
              placeholder="3"
              className={inputClass("sets")}
            />
            {errors.sets && <p className="text-red-400 text-xs mt-1">{errors.sets}</p>}
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">
              Tekrar <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="reps"
              value={form.reps}
              onChange={handleChange}
              min="1"
              placeholder="10"
              className={inputClass("reps")}
            />
            {errors.reps && <p className="text-red-400 text-xs mt-1">{errors.reps}</p>}
          </div>
        </div>

        {/* Ağırlık & Süre */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Ağırlık (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              min="0"
              step="0.5"
              placeholder="60"
              className={inputClass("weight")}
            />
            {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Süre (dk)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              min="0"
              placeholder="45"
              className={inputClass("duration")}
            />
            {errors.duration && (
              <p className="text-red-400 text-xs mt-1">{errors.duration}</p>
            )}
          </div>
        </div>

        {/* Yakılan Kalori */}
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">Yakılan Kalori (kcal)</label>
          <input
            type="number"
            name="caloriesBurned"
            value={form.caloriesBurned}
            onChange={handleChange}
            min="0"
            placeholder="300"
            className={inputClass("caloriesBurned")}
          />
          {errors.caloriesBurned && (
            <p className="text-red-400 text-xs mt-1">{errors.caloriesBurned}</p>
          )}
        </div>

        {/* Notlar */}
        <div className="mb-4">
          <label className="block text-gray-400 text-xs mb-1">Notlar (opsiyonel)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            placeholder="İpuçları, hissettiklerin…"
            className={`${inputClass("notes")} resize-none`}
          />
        </div>

        {/* Butonlar */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold 
                       py-2.5 rounded-xl text-sm transition-colors"
          >
            {editingItem ? "Güncelle" : "Ekle"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold 
                         py-2.5 rounded-xl text-sm transition-colors"
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
