const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, userId } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Title is required'
      });
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Due date cannot be in the past'
      });
    }

    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!userExists) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Assigned user does not exist'
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: userId || null
      },
      include: { assignedTo: true }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

// GET ALL TASKS
const getAllTasks = async (req, res) => {
  try {
    const { status, priority, userId } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (userId) filters.userId = userId;

    // Collaborators only see their own tasks
    if (req.user.role === 'COLLABORATOR') {
      filters.userId = req.user.id;
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ tasks });

  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

// GET ONE TASK
const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { assignedTo: { select: { id: true, name: true, email: true } } }
    });

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found'
      });
    }

    // Collaborators can only see their own tasks
    if (req.user.role === 'COLLABORATOR' && task.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to view this task'
      });
    }

    res.json({ task });

  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, userId } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found'
      });
    }

    // Collaborators can only update status
    if (req.user.role === 'COLLABORATOR') {
      if (task.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only update your own tasks'
        });
      }
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { status },
        include: { assignedTo: true }
      });
      return res.json({ message: 'Task updated', task: updatedTask });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || task.title,
        description: description ?? task.description,
        status: status || task.status,
        priority: priority || task.priority,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        userId: userId !== undefined ? userId : task.userId
      },
      include: { assignedTo: true }
    });

    res.json({ message: 'Task updated successfully', task: updatedTask });

  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found'
      });
    }

    if (req.user.role === 'COLLABORATOR') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Collaborators cannot delete tasks'
      });
    }

    await prisma.task.delete({ where: { id } });

    res.json({ message: 'Task deleted successfully' });

  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

module.exports = { createTask, getAllTasks, getTask, updateTask, deleteTask };