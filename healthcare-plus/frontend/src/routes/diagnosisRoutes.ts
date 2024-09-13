// src/routes/diagnosisRoutes.ts
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Diagnosis route' });
});

export default router;