// progress.routes.js - Route definitions for Progress Service
const express = require('express');
const router = express.Router();
const {
  addProgress,
  getAllProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
} = require('../controllers/progress.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProgressEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         weightKg:
 *           type: number
 *           example: 72.5
 *         heightCm:
 *           type: number
 *           example: 175
 *         bmi:
 *           type: number
 *           example: 23.67
 *         bmiCategory:
 *           type: string
 *           example: "Normal weight"
 *         bodyFatPercent:
 *           type: number
 *           example: 18.5
 *         muscleMassKg:
 *           type: number
 *           example: 35.2
 *         notes:
 *           type: string
 *           example: "Feeling great after 2 weeks of training"
 *         recordedDate:
 *           type: string
 *           format: date
 *           example: "2026-03-25"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AddProgressRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         weightKg:
 *           type: number
 *           example: 72.5
 *         heightCm:
 *           type: number
 *           example: 175
 *         bodyFatPercent:
 *           type: number
 *           example: 18.5
 *         muscleMassKg:
 *           type: number
 *           example: 35.2
 *         notes:
 *           type: string
 *           example: "Post-workout measurement"
 *         recordedDate:
 *           type: string
 *           example: "2026-03-25"
 */

/**
 * @swagger
 * /api/progress:
 *   post:
 *     summary: Add a new progress entry
 *     tags: [Progress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProgressRequest'
 *     responses:
 *       201:
 *         description: Progress entry added
 *       400:
 *         description: Validation error
 */
router.post('/', addProgress);

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Get all progress entries
 *     tags: [Progress]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter entries by user ID
 *     responses:
 *       200:
 *         description: List of progress entries
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllProgress);

/**
 * @swagger
 * /api/progress/{id}:
 *   get:
 *     summary: Get a progress entry by ID
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress entry details
 *       404:
 *         description: Entry not found
 */
router.get('/:id', getProgressById);

/**
 * @swagger
 * /api/progress/{id}:
 *   put:
 *     summary: Update a progress entry
 *     tags: [Progress]
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
 *             $ref: '#/components/schemas/AddProgressRequest'
 *     responses:
 *       200:
 *         description: Entry updated
 *       404:
 *         description: Entry not found
 */
router.put('/:id', updateProgress);

/**
 * @swagger
 * /api/progress/{id}:
 *   delete:
 *     summary: Delete a progress entry
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry deleted
 *       404:
 *         description: Entry not found
 */
router.delete('/:id', deleteProgress);

module.exports = router;
