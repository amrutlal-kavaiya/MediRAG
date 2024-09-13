import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Utensils, Calendar, Brain } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md">
        <div className="container mx-auto py-4 px-6">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold">MediRAG</div>
            <ul className="flex space-x-6">
              <li><Link to="/" className="hover:text-blue-200 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-200 transition">About</Link></li>
              <li><Link to="/services" className="hover:text-blue-200 transition">Services</Link></li>
              <li><Link to="/contact" className="hover:text-blue-200 transition">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to MediRAG</h1>
            <p className="text-xl mb-8">Your Comprehensive Healthcare Companion</p>
            <Link to="/services" className="bg-white text-blue-500 py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300">
              Explore Our Services
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard 
                icon={<FileText size={40} />}
                title="X-ray and Document Diagnosis"
                description="Advanced AI-powered analysis of medical images and documents for quick and accurate diagnoses."
                link="/xray-diagnosis"
              />
              <FeatureCard 
                icon={<Utensils size={40} />}
                title="Personalized Health Plans"
                description="Tailored nutrition and sleep recommendations based on your unique health profile and goals."
                link="/health-plans"
              />
              <FeatureCard 
                icon={<Calendar size={40} />}
                title="Appointment Scheduling"
                description="Effortless booking of medical appointments with healthcare professionals at your convenience."
                link="/appointments"
              />
              <FeatureCard 
                icon={<Brain size={40} />}
                title="Mental Health Support"
                description="24/7 access to mental health resources, including AI-assisted counseling and professional support."
                link="/mental-health"
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose MediRAG?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ReasonCard
                title="Comprehensive Care"
                description="Access a wide range of health services under one platform, from diagnostics to personalized health plans."
              />
              <ReasonCard
                title="Cutting-edge Technology"
                description="Benefit from our state-of-the-art AI and machine learning algorithms for accurate health insights."
              />
              <ReasonCard
                title="Personalized Approach"
                description="Receive tailored health recommendations and support based on your unique health profile and needs."
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get Started Today</h2>
            <div className="text-center">
              <p className="text-xl mb-8">Experience the future of healthcare with MediRAG. Our innovative platform combines advanced technology with personalized care to provide you with the best possible health outcomes.</p>
              <Link to="/signup" className="bg-blue-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300">
                Sign Up Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">MediRAG</h3>
              <p className="mt-2">Your healthcare companion</p>
            </div>
            <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/services" className="hover:text-blue-200 transition">Services</Link></li>
                <li><Link to="/about" className="hover:text-blue-200 transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-200 transition">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-200 transition">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right">
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="#" className="hover:text-blue-200 transition"><i className="fab fa-facebook"></i></a>
                <a href="#" className="hover:text-blue-200 transition"><i className="fab fa-twitter"></i></a>
                <a href="#" className="hover:text-blue-200 transition"><i className="fab fa-instagram"></i></a>
                <a href="#" className="hover:text-blue-200 transition"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-500 mt-8 pt-6 text-center">
            <p>&copy; 2024 MediRAG. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string }> = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-200">
      <div className="flex flex-col items-center text-center">
        <div className="text-blue-500 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

const ReasonCard: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;