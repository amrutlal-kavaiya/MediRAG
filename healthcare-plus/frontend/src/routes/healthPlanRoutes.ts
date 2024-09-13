// src/routes/healthPlanRoutes.ts
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Health Plan route' });
});

export default router;