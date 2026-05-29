const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// All routes require login
router.use(protect);

router.get('/', getAllTasks);
router.get('/:id', getTask);
router.post('/', restrictTo('ADMIN', 'PROJECT_MANAGER'), createTask);
router.put('/:id', updateTask);
router.delete('/:id', restrictTo('ADMIN', 'PROJECT_MANAGER'), deleteTask);

module.exports = router;