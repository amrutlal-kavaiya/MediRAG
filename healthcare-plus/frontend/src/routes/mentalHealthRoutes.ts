// src/routes/mentalHealthRoutes.ts
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Mental Health route' });
});

export default router;