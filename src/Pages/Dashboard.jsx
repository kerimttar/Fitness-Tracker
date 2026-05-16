// ============================================================
// Pages/Dashboard.jsx
// Ana panel: state yönetimi + tüm bileşenlerin koordinasyonu
// ============================================================

import React, { useState } from "react";
import { DEFAULT_GOALS } from "../Interfaces/types";
import ProgressBar from "../Components/ProgressBar";
import ExerciseForm from "../Components/ExerciseForm";
import ExerciseList from "../Components/ExerciseList";
import MealForm from "../Components/MealForm";
import MealList from "../Components/MealList";

// ---- Başlangıç örnek verileri ----------------------------------
const INITIAL_EXERCISES = [
  {
    id: "demo-ex-1",
    name: "Bench Press",
    category: "Güç",
    sets: 4,
    reps: 8,
    weight: 80,
    duration: 20,
    caloriesBurned: 150,
    date: new Date().toISOString(),
    notes: "Son sette zorlandım.",
  },
  {
    id: "demo-ex-2",
    name: "Koşu Bandı",
    category: "Kardiyo",
    sets: 1,
    reps: 1,
    weight: 0,
    duration: 30,
    caloriesBurned: 280,
    date: new Date().toISOString(),
    notes: "",
  },
];

const INITIAL_MEALS = [
  {
    id: "demo-meal-1",
    name: "Yulaf Ezmesi + Muz",
    mealType: "Kahvaltı",
    calories: 380,
    protein: 12,
    carbs: 65,
    fat: 7,
    date: new Date().toISOString(),
  },
  {
    id: "demo-meal-2",
    name: "Tavuk Göğsü + Pilav",
    mealType: "Öğle",
    calories: 520,
    protein: 48,
    carbs: 52,
    fat: 9,
    date: new Date().toISOString(),
  },
];
// ----------------------------------------------------------------

const TABS = [
  { id: "exercise", label: "Egzersiz", icon: "🏋️" },
  { id: "meal", label: "Beslenme", icon: "🍽️" },
];

export default function Dashboard() {
  // ---- State -----
  const [exercises, setExercises] = useState(INITIAL_EXERCISES);
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [goals] = useState(DEFAULT_GOALS);
  const [activeTab, setActiveTab] = useState("exercise");

  // Düzenleme state'leri
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

  // ---- Egzersiz CRUD -----
  function handleSaveExercise(exercise) {
    setExercises((prev) => {
      const exists = prev.find((e) => e.id === exercise.id);
      if (exists) {
        // UPDATE
        return prev.map((e) => (e.id === exercise.id ? exercise : e));
      }
      // CREATE
      return [exercise, ...prev];
    });
    setEditingExercise(null);
  }

  function handleDeleteExercise(id) {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    if (editingExercise?.id === id) setEditingExercise(null);
  }

  // ---- Öğün CRUD -----
  function handleSaveMeal(meal) {
    setMeals((prev) => {
      const exists = prev.find((m) => m.id === meal.id);
      if (exists) {
        return prev.map((m) => (m.id === meal.id ? meal : m));
      }
      return [meal, ...prev];
    });
    setEditingMeal(null);
  }

  function handleDeleteMeal(id) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    if (editingMeal?.id === id) setEditingMeal(null);
  }

  // ---- Hesaplamalar -----
  const totalCaloriesConsumed = meals.reduce((s, m) => s + m.calories, 0);
  const totalCaloriesBurned = exercises.reduce((s, e) => s + (e.caloriesBurned || 0), 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalWorkoutDuration = exercises.reduce((s, e) => s + (e.duration || 0), 0);
  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ══════ HEADER ══════ */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 
                            flex items-center justify-center text-lg shadow-lg">
              ⚡
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">FitTrack</h1>
              <p className="text-gray-500 text-xs">Günlük Sağlık & Performans Asistanı</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">
              {new Date().toLocaleDateString("tr-TR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ══════ NET KALORİ KARTI ══════ */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-800/60 border border-gray-700 
                        rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs mb-1">Net Kalori (Alınan − Yakılan)</p>
            <p
              className={`text-3xl font-black ${
                netCalories > goals.calorieIntakeGoal
                  ? "text-red-400"
                  : netCalories < 0
                  ? "text-emerald-400"
                  : "text-white"
              }`}
            >
              {netCalories > 0 ? "+" : ""}
              {netCalories.toLocaleString("tr-TR")} kcal
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-rose-400">
                {totalCaloriesConsumed.toLocaleString("tr-TR")}
              </p>
              <p className="text-gray-500 text-xs">Alınan kcal</p>
            </div>
            <div className="w-px bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {totalCaloriesBurned.toLocaleString("tr-TR")}
              </p>
              <p className="text-gray-500 text-xs">Yakılan kcal</p>
            </div>
            <div className="w-px bg-gray-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{totalWorkoutDuration}</p>
              <p className="text-gray-500 text-xs">Antrenman dk</p>
            </div>
          </div>
        </div>

        {/* ══════ İLERLEME ÇUBUKLARI ══════ */}
        <section>
          <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">
            Günlük Hedefler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProgressBar
              label="Kalori Alımı"
              current={totalCaloriesConsumed}
              goal={goals.calorieIntakeGoal}
              unit="kcal"
              colorClass="bg-rose-500"
              icon="🍽️"
            />
            <ProgressBar
              label="Kalori Yakımı"
              current={totalCaloriesBurned}
              goal={goals.calorieBurnGoal}
              unit="kcal"
              colorClass="bg-orange-500"
              icon="🔥"
            />
            <ProgressBar
              label="Protein"
              current={Math.round(totalProtein)}
              goal={goals.proteinGoal}
              unit="g"
              colorClass="bg-blue-500"
              icon="🥩"
            />
            <ProgressBar
              label="Antrenman"
              current={totalWorkoutDuration}
              goal={goals.workoutDurationGoal}
              unit="dk"
              colorClass="bg-emerald-500"
              icon="⏱️"
            />
          </div>
        </section>

        {/* ══════ SEKMELER ══════ */}
        <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold 
                          transition-all ${
                            activeTab === tab.id
                              ? "bg-gray-700 text-white shadow"
                              : "text-gray-500 hover:text-gray-300"
                          }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ml-1 ${
                  activeTab === tab.id
                    ? "bg-gray-600 text-gray-200"
                    : "bg-gray-700 text-gray-500"
                }`}
              >
                {tab.id === "exercise" ? exercises.length : meals.length}
              </span>
            </button>
          ))}
        </div>

        {/* ══════ EGZERSİZ PANELI ══════ */}
        {activeTab === "exercise" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Form */}
            <div className="lg:col-span-2">
              <ExerciseForm
                onSave={handleSaveExercise}
                editingItem={editingExercise}
                onCancelEdit={() => setEditingExercise(null)}
              />
            </div>
            {/* Liste */}
            <div className="lg:col-span-3">
              <ExerciseList
                exercises={exercises}
                onEdit={(ex) => { setEditingExercise(ex); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onDelete={handleDeleteExercise}
              />
            </div>
          </div>
        )}

        {/* ══════ BESLENME PANELI ══════ */}
        {activeTab === "meal" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Form */}
            <div className="lg:col-span-2">
              <MealForm
                onSave={handleSaveMeal}
                editingItem={editingMeal}
                onCancelEdit={() => setEditingMeal(null)}
              />
            </div>
            {/* Liste */}
            <div className="lg:col-span-3">
              <MealList
                meals={meals}
                onEdit={(meal) => { setEditingMeal(meal); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onDelete={handleDeleteMeal}
              />
            </div>
          </div>
        )}
      </main>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-gray-800 mt-10 py-4 text-center">
        <p className="text-gray-600 text-xs">
          FitTrack — Web Geliştirme Eğitim Projesi · ReactJS + Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
