import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Calendar, Clock, User, Phone, Clipboard, Check, Mail, Heart, Stethoscope } from 'lucide-react';

interface Appointment {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  doctor: string;
  appointmentType: string;
  reason: string;
  symptoms: string;
  medicalHistory: string;
}

const doctors = [
  "Dr. Smith - General Practice",
  "Dr. Johnson - Cardiology",
  "Dr. Williams - Pediatrics",
  "Dr. Brown - Dermatology",
  "Dr. Jones - Orthopedics"
];

const appointmentTypes = [
  "Regular Check-up",
  "Follow-up",
  "New Patient Consultation",
  "Urgent Care",
  "Specialist Consultation",
  "Vaccination"
];

const AppointmentScheduling: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment>({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    doctor: '',
    appointmentType: '',
    reason: '',
    symptoms: '',
    medicalHistory: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointment((prev: Appointment) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitted(false);

    // Basic form validation
    if (!appointment.date || !appointment.time || !appointment.name || !appointment.email || !appointment.phone || !appointment.doctor || !appointment.appointmentType) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // Here you would typically send the appointment data to your backend
      // For this example, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError('An error occurred while scheduling your appointment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-purple-500 font-semibold mb-1">Medical Care</div>
          <h2 className="text-2xl leading-tight font-bold text-gray-900 mb-5">Schedule Your Medical Appointment</h2>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                    Date*
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={appointment.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-purple-500" />
                    Time*
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={appointment.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
                  <User className="mr-2 h-5 w-5 text-purple-500" />
                  Full Name*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={appointment.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-purple-500" />
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={appointment.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-purple-500" />
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={appointment.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5 text-purple-500" />
                  Select Doctor*
                </label>
                <select
                  name="doctor"
                  id="doctor"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={appointment.doctor}
                  onChange={handleInputChange}
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Clipboard className="mr-2 h-5 w-5 text-purple-500" />
                  Appointment Type*
                </label>
                <select
                  name="appointmentType"
                  id="appointmentType"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={appointment.appointmentType}
                  onChange={handleInputChange}
                >
                  <option value="">Select appointment type</option>
                  {appointmentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Clipboard className="mr-2 h-5 w-5 text-purple-500" />
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  id="reason"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={appointment.reason}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-purple-500" />
                  Current Symptoms
                </label>
                <textarea
                  name="symptoms"
                  id="symptoms"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={appointment.symptoms}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 flex items-center">
                  <Clipboard className="mr-2 h-5 w-5 text-purple-500" />
                  Brief Medical History
                </label>
                <textarea
                  name="medicalHistory"
                  id="medicalHistory"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={appointment.medicalHistory}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <Check className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Appointment Scheduled</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your appointment with {appointment.doctor} has been successfully scheduled for {appointment.date} at {appointment.time}.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Appointment Type: {appointment.appointmentType}
              </p>
              <p className="mt-4 text-sm text-gray-700">
                We'll send a confirmation email to {appointment.email}. If you need to make any changes, please contact our office.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduling;