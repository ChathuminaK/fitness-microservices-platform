// nutrition.controller.js - Business logic for Nutrition/Meal operations
const MealModel = require('../models/meal.model');

/**
 * @desc  Add a new meal plan entry
 * @route POST /api/nutrition
 */
const addMeal = (req, res) => {
  try {
    const { userId, mealName, mealType, items, scheduledDate, notes } = req.body;

    if (!mealName) {
      return res.status(400).json({ success: false, message: 'mealName is required.' });
    }

    const meal = MealModel.create({ userId, mealName, mealType, items, scheduledDate, notes });

    return res.status(201).json({
      success: true,
      message: 'Meal plan added successfully.',
      data: meal,
    });
  } catch (error) {
    console.error('[NutritionController] addMeal error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get all meals (optionally by userId)
 * @route GET /api/nutrition
 */
const getAllMeals = (req, res) => {
  try {
    const { userId } = req.query;
    const meals = MealModel.findAll(userId);
    return res.status(200).json({ success: true, count: meals.length, data: meals });
  } catch (error) {
    console.error('[NutritionController] getAllMeals error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get a single meal by ID
 * @route GET /api/nutrition/:id
 */
const getMealById = (req, res) => {
  try {
    const meal = MealModel.findById(req.params.id);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found.' });
    return res.status(200).json({ success: true, data: meal });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Update a meal entry
 * @route PUT /api/nutrition/:id
 */
const updateMeal = (req, res) => {
  try {
    const existing = MealModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Meal not found.' });

    const updated = MealModel.update(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Meal updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Delete a meal entry
 * @route DELETE /api/nutrition/:id
 */
const deleteMeal = (req, res) => {
  try {
    const deleted = MealModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Meal not found.' });
    return res.status(200).json({ success: true, message: 'Meal deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { addMeal, getAllMeals, getMealById, updateMeal, deleteMeal };
