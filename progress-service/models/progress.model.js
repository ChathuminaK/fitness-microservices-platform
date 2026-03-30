// progress.model.js - In-memory storage model for Progress entries
const { v4: uuidv4 } = require('uuid');

// In-memory store
const progressEntries = [];

/**
 * Helper: calculate BMI from weight (kg) and height (cm)
 */
const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
};

/**
 * Helper: classify BMI category
 */
const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal weight';
  if (bmi < 30.0) return 'Overweight';
  return 'Obese';
};

const ProgressModel = {
  /** Get all entries, optionally filtered by userId */
  findAll(userId) {
    if (userId) return progressEntries.filter((p) => p.userId === userId);
    return [...progressEntries];
  },

  /** Find a single entry by ID */
  findById(id) {
    return progressEntries.find((p) => p.id === id) || null;
  },

  /** Create a new progress entry */
  create({ userId, weightKg, heightCm, bodyFatPercent, muscleMassKg, notes, recordedDate }) {
    const bmi = calculateBMI(weightKg, heightCm);
    const entry = {
      id: uuidv4(),
      userId: userId || null,
      weightKg: weightKg || null,
      heightCm: heightCm || null,
      bmi,
      bmiCategory: getBMICategory(bmi),
      bodyFatPercent: bodyFatPercent || null,
      muscleMassKg: muscleMassKg || null,
      notes: notes || '',
      recordedDate: recordedDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    progressEntries.push(entry);
    return entry;
  },

  /** Update a progress entry */
  update(id, updates) {
    const index = progressEntries.findIndex((p) => p.id === id);
    if (index === -1) return null;

    // Recalculate BMI if weight or height changed
    const newWeight = updates.weightKg !== undefined ? updates.weightKg : progressEntries[index].weightKg;
    const newHeight = updates.heightCm !== undefined ? updates.heightCm : progressEntries[index].heightCm;
    const bmi = calculateBMI(newWeight, newHeight);

    progressEntries[index] = {
      ...progressEntries[index],
      ...updates,
      id: progressEntries[index].id,
      userId: progressEntries[index].userId,
      bmi,
      bmiCategory: getBMICategory(bmi),
      createdAt: progressEntries[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return progressEntries[index];
  },

  /** Delete a progress entry */
  delete(id) {
    const index = progressEntries.findIndex((p) => p.id === id);
    if (index === -1) return false;
    progressEntries.splice(index, 1);
    return true;
  },
};

module.exports = ProgressModel;
