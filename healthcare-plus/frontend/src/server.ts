// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import diagnosisRoutes from './routes/diagnosisRoutes';
import healthPlanRoutes from './routes/healthPlanRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import mentalHealthRoutes from './routes/mentalHealthRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/health-plan', healthPlanRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/mental-health', mentalHealthRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});