// meal.model.js - In-memory storage model for Meal Plans
const { v4: uuidv4 } = require('uuid');

// In-memory store
const meals = [];

/**
 * Helper: calculate total macros across food items
 */
const calcTotals = (items = []) => {
  return items.reduce(
    (acc, item) => ({
      totalCalories: acc.totalCalories + (item.calories || 0),
      totalProteinG: acc.totalProteinG + (item.proteinG || 0),
      totalCarbsG: acc.totalCarbsG + (item.carbsG || 0),
      totalFatG: acc.totalFatG + (item.fatG || 0),
    }),
    { totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0 }
  );
};

const MealModel = {
  /** Get all meals, optionally filtered by userId */
  findAll(userId) {
    if (userId) return meals.filter((m) => m.userId === userId);
    return [...meals];
  },

  /** Find a meal by ID */
  findById(id) {
    return meals.find((m) => m.id === id) || null;
  },

  /** Create a new meal plan entry */
  create({ userId, mealName, mealType, items, scheduledDate, notes }) {
    const mealItems = items || [];
    const totals = calcTotals(mealItems);

    const meal = {
      id: uuidv4(),
      userId: userId || null,
      mealName,
      mealType: mealType || 'snack', // breakfast | lunch | dinner | snack | pre-workout | post-workout
      items: mealItems,
      ...totals,
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    meals.push(meal);
    return meal;
  },

  /** Update a meal plan entry */
  update(id, updates) {
    const index = meals.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const newItems = updates.items !== undefined ? updates.items : meals[index].items;
    const totals = calcTotals(newItems);

    meals[index] = {
      ...meals[index],
      ...updates,
      id: meals[index].id,
      userId: meals[index].userId,
      items: newItems,
      ...totals,
      createdAt: meals[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return meals[index];
  },

  /** Delete a meal */
  delete(id) {
    const index = meals.findIndex((m) => m.id === id);
    if (index === -1) return false;
    meals.splice(index, 1);
    return true;
  },
};

module.exports = MealModel;
