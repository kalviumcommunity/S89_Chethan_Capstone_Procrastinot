// src/pages/Pomodoro.jsx
import PomodoroTimer from "../components/PomodoroTimer";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer";

export default function Pomodoro() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <Navbar />
      <div className="pt-28 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">⌛Pomodoro Session</h1>
        <PomodoroTimer />

       
      </div>
      <Footer />
     
    </div>
  );
}
