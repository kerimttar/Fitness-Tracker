// ============================================================
// Interfaces/types.js
// Proje genelinde kullanılan veri modelleri (JSDoc ile tanımlı)
// ============================================================

/**
 * @typedef {Object} Exercise
 * @property {string} id          - Benzersiz kimlik (Date.now tabanlı)
 * @property {string} name        - Egzersiz adı (ör: "Bench Press")
 * @property {string} category    - Kategori: "Güç" | "Kardiyo" | "Esneklik"
 * @property {number} sets        - Set sayısı
 * @property {number} reps        - Tekrar sayısı
 * @property {number} weight      - Ağırlık (kg); kardiyo için 0
 * @property {number} duration    - Süre (dakika)
 * @property {number} caloriesBurned - Yakılan kalori (tahmini)
 * @property {string} date        - ISO tarih string'i
 * @property {string} notes       - Opsiyonel notlar
 */

/**
 * @typedef {Object} Meal
 * @property {string} id          - Benzersiz kimlik
 * @property {string} name        - Yemek adı (ör: "Yulaf Ezmesi")
 * @property {string} mealType    - Öğün tipi: "Kahvaltı" | "Öğle" | "Akşam" | "Ara Öğün"
 * @property {number} calories    - Kalori (kcal)
 * @property {number} protein     - Protein (g)
 * @property {number} carbs       - Karbonhidrat (g)
 * @property {number} fat         - Yağ (g)
 * @property {string} date        - ISO tarih string'i
 */

/**
 * @typedef {Object} DailyGoals
 * @property {number} calorieIntakeGoal   - Günlük kalori hedefi (kcal)
 * @property {number} calorieBurnGoal     - Günlük yakma hedefi (kcal)
 * @property {number} proteinGoal         - Günlük protein hedefi (g)
 * @property {number} workoutDurationGoal - Günlük egzersiz süresi hedefi (dk)
 */

/**
 * Yeni bir Exercise nesnesi oluşturmak için fabrika fonksiyonu.
 * @param {Partial<Exercise>} fields
 * @returns {Exercise}
 */
export function createExercise(fields = {}) {
  return {
    id: String(Date.now()),
    name: "",
    category: "Güç",
    sets: 1,
    reps: 1,
    weight: 0,
    duration: 0,
    caloriesBurned: 0,
    date: new Date().toISOString(),
    notes: "",
    ...fields,
  };
}

/**
 * Yeni bir Meal nesnesi oluşturmak için fabrika fonksiyonu.
 * @param {Partial<Meal>} fields
 * @returns {Meal}
 */
export function createMeal(fields = {}) {
  return {
    id: String(Date.now()),
    name: "",
    mealType: "Kahvaltı",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date().toISOString(),
    ...fields,
  };
}

/**
 * Varsayılan günlük hedefler.
 * @type {DailyGoals}
 */
export const DEFAULT_GOALS = {
  calorieIntakeGoal: 2000,
  calorieBurnGoal: 500,
  proteinGoal: 150,
  workoutDurationGoal: 60,
};

export const EXERCISE_CATEGORIES = ["Güç", "Kardiyo", "Esneklik", "HIIT", "Diğer"];
export const MEAL_TYPES = ["Kahvaltı", "Öğle", "Akşam", "Ara Öğün"];
