// ============================================================
// Components/MealForm.jsx
// Öğün ekleme ve güncelleme formu (CREATE + UPDATE)
// ============================================================

import React, { useState, useEffect } from "react";
import { createMeal, MEAL_TYPES } from "../Interfaces/types";

const EMPTY_FORM = {
  name: "",
  mealType: "Kahvaltı",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

/**
 * @param {Object}      props
 * @param {Function}    props.onSave        - (meal) => void
 * @param {Object|null} props.editingItem   - Düzenlenen öğün; null ise yeni
 * @param {Function}    props.onCancelEdit
 */
export default function MealForm({ onSave, editingItem, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name,
        mealType: editingItem.mealType,
        calories: String(editingItem.calories),
        protein: String(editingItem.protein),
        carbs: String(editingItem.carbs),
        fat: String(editingItem.fat),
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Yemek adı boş bırakılamaz.";
    if (form.name.trim().length > 60) newErrors.name = "Ad en fazla 60 karakter olabilir.";

    const numFields = [
      { key: "calories", label: "Kalori", min: 0, max: 10000, required: true },
      { key: "protein", label: "Protein", min: 0, max: 500, required: false },
      { key: "carbs", label: "Karbonhidrat", min: 0, max: 1000, required: false },
      { key: "fat", label: "Yağ", min: 0, max: 500, required: false },
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
          newErrors[key] = `${label} negatif olamaz.`;
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
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const meal = createMeal({
      ...(editingItem ? { id: editingItem.id, date: editingItem.date } : {}),
      name: form.name.trim(),
      mealType: form.mealType,
      calories: Number(form.calories),
      protein: form.protein === "" ? 0 : Number(form.protein),
      carbs: form.carbs === "" ? 0 : Number(form.carbs),
      fat: form.fat === "" ? 0 : Number(form.fat),
    });

    onSave(meal);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  const inputClass = (field) =>
    `w-full bg-gray-700 border rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 
     focus:outline-none focus:ring-2 transition-all ${
       errors[field]
         ? "border-red-500 focus:ring-red-500/40"
         : "border-gray-600 focus:ring-rose-500/40 focus:border-rose-500"
     }`;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
      <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
        <span className="text-xl">{editingItem ? "✏️" : "🍽️"}</span>
        {editingItem ? "Öğünü Güncelle" : "Öğün Ekle"}
      </h2>

      <form onSubmit={handleSubmit} noValidate className={shake ? "animate-shake" : ""}>
        {/* Yemek Adı */}
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">
            Yemek Adı <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="ör: Yulaf Ezmesi, Tavuk Göğsü…"
            className={inputClass("name")}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Öğün Tipi */}
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">Öğün</label>
          <select
            name="mealType"
            value={form.mealType}
            onChange={handleChange}
            className={inputClass("mealType")}
          >
            {MEAL_TYPES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Kalori */}
        <div className="mb-3">
          <label className="block text-gray-400 text-xs mb-1">
            Kalori (kcal) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="calories"
            value={form.calories}
            onChange={handleChange}
            min="0"
            placeholder="350"
            className={inputClass("calories")}
          />
          {errors.calories && <p className="text-red-400 text-xs mt-1">{errors.calories}</p>}
        </div>

        {/* Makro besinler */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { key: "protein", label: "Protein (g)", placeholder: "30" },
            { key: "carbs", label: "Karb. (g)", placeholder: "40" },
            { key: "fat", label: "Yağ (g)", placeholder: "10" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-gray-400 text-xs mb-1">{label}</label>
              <input
                type="number"
                name={key}
                value={form[key]}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder={placeholder}
                className={inputClass(key)}
              />
              {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}
        </div>

        {/* Butonlar */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold 
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
