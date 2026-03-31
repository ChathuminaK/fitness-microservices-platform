// workout.routes.js - Route definitions for Workout Service
const express = require('express');
const router = express.Router();
const {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require('../controllers/workout.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Push-ups"
 *         sets:
 *           type: integer
 *           example: 3
 *         reps:
 *           type: integer
 *           example: 15
 *         restSeconds:
 *           type: integer
 *           example: 60
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *           example: "Morning Strength Training"
 *         description:
 *           type: string
 *         type:
 *           type: string
 *           enum: [strength, cardio, yoga, hiit, flexibility, general]
 *           example: "strength"
 *         duration:
 *           type: integer
 *           example: 45
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *         scheduledDate:
 *           type: string
 *           format: date
 *           example: "2026-03-31"
 *         status:
 *           type: string
 *           enum: [planned, completed, skipped]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateWorkoutRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *           example: "Morning Strength Training"
 *         description:
 *           type: string
 *           example: "Full body strength workout"
 *         type:
 *           type: string
 *           example: "strength"
 *         duration:
 *           type: integer
 *           example: 45
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *         scheduledDate:
 *           type: string
 *           example: "2026-03-31"
 */

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout plan
 *     tags: [Workouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkoutRequest'
 *     responses:
 *       201:
 *         description: Workout plan created
 *       400:
 *         description: Validation error
 */
router.post('/', createWorkout);

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workout plans
 *     tags: [Workouts]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter workouts by user ID
 *     responses:
 *       200:
 *         description: List of all workouts
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
 *                     $ref: '#/components/schemas/Workout'
 */
router.get('/', getAllWorkouts);

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Get workout by ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout details
 *       404:
 *         description: Workout not found
 */
router.get('/:id', getWorkoutById);

/**
 * @swagger
 * /api/workouts/{id}:
 *   put:
 *     summary: Update a workout plan
 *     tags: [Workouts]
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
 *             $ref: '#/components/schemas/CreateWorkoutRequest'
 *     responses:
 *       200:
 *         description: Workout updated
 *       404:
 *         description: Workout not found
 */
router.put('/:id', updateWorkout);

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete a workout plan
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout deleted
 *       404:
 *         description: Workout not found
 */
router.delete('/:id', deleteWorkout);

module.exports = router;
