// src/routes/appointmentRoutes.ts
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for appointments
let appointments: any[] = [];

// Get all appointments
router.get('/', (req, res) => {
  res.json(appointments);
});

// Create a new appointment
router.post('/', (req, res) => {
  const newAppointment = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date()
  };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// Update an appointment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  if (appointmentIndex > -1) {
    appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...req.body };
    res.json(appointments[appointmentIndex]);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

// Delete an appointment
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = appointments.length;
  appointments = appointments.filter(apt => apt.id !== id);
  if (appointments.length < initialLength) {
    res.json({ message: 'Appointment deleted successfully' });
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

export default router;