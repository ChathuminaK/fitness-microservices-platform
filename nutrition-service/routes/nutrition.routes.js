// nutrition.routes.js - Route definitions for Nutrition Service
const express = require('express');
const router = express.Router();
const {
  addMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/nutrition.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Chicken Breast"
 *         quantity:
 *           type: string
 *           example: "150g"
 *         calories:
 *           type: number
 *           example: 248
 *         proteinG:
 *           type: number
 *           example: 46.5
 *         carbsG:
 *           type: number
 *           example: 0
 *         fatG:
 *           type: number
 *           example: 5.4
 *     Meal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         mealName:
 *           type: string
 *           example: "Post-workout meal"
 *         mealType:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack, pre-workout, post-workout]
 *           example: "post-workout"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodItem'
 *         totalCalories:
 *           type: number
 *           example: 500
 *         totalProteinG:
 *           type: number
 *           example: 50
 *         totalCarbsG:
 *           type: number
 *           example: 40
 *         totalFatG:
 *           type: number
 *           example: 10
 *         scheduledDate:
 *           type: string
 *           format: date
 *           example: "2026-03-25"
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateMealRequest:
 *       type: object
 *       required:
 *         - mealName
 *       properties:
 *         userId:
 *           type: string
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         mealName:
 *           type: string
 *           example: "Post-workout meal"
 *         mealType:
 *           type: string
 *           example: "post-workout"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodItem'
 *         scheduledDate:
 *           type: string
 *           example: "2026-03-25"
 *         notes:
 *           type: string
 *           example: "High protein meal"
 */

/**
 * @swagger
 * /api/nutrition:
 *   post:
 *     summary: Add a new meal plan
 *     tags: [Nutrition]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMealRequest'
 *     responses:
 *       201:
 *         description: Meal created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', addMeal);

/**
 * @swagger
 * /api/nutrition:
 *   get:
 *     summary: Get all meal plans
 *     tags: [Nutrition]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter meals by user ID
 *     responses:
 *       200:
 *         description: List of all meals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meal'
 */
router.get('/', getAllMeals);

/**
 * @swagger
 * /api/nutrition/{id}:
 *   get:
 *     summary: Get a meal by ID
 *     tags: [Nutrition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meal details
 *       404:
 *         description: Meal not found
 */
router.get('/:id', getMealById);

/**
 * @swagger
 * /api/nutrition/{id}:
 *   put:
 *     summary: Update a meal plan
 *     tags: [Nutrition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMealRequest'
 *     responses:
 *       200:
 *         description: Meal updated
 *       404:
 *         description: Meal not found
 */
router.put('/:id', updateMeal);

/**
 * @swagger
 * /api/nutrition/{id}:
 *   delete:
 *     summary: Delete a meal plan
 *     tags: [Nutrition]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meal deleted
 *       404:
 *         description: Meal not found
 */
router.delete('/:id', deleteMeal);

module.exports = router;
