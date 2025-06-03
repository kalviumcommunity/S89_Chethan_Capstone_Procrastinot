export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-6 px-4">
      <div className="text-sm">
        © {new Date().getFullYear()} Procrastinot. Built with 💻 by Team Kalvium.
      </div>
      <div className="text-xs mt-1 opacity-70">
        Icons by Lucide · Fonts by Google · Powered by OpenAI
      </div>
    </footer>
  );
}
