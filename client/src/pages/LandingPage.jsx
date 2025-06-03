import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
