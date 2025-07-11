import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/chethan-gen',
      label: 'GitHub',
      description: 'Check out my projects on GitHub'
    },
    {
      icon: Twitter,
      href: 'https://x.com/ChethanRegala',
      label: 'Twitter',
      description: 'Follow me on Twitter'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/chethan-regala-9b671a34a',
      label: 'LinkedIn',
      description: 'Connect with me on LinkedIn'
    },
    {
      icon: Mail,
      href: 'mailto:chaithuregala123@gmail.com',
      label: 'Email',
      description: 'Send me an email'
    },
  ];

  return (
    <footer className="relative py-16 px-6 border-t border-white/10">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="text-2xl">🧠</span>
              <span className="text-xl font-display font-bold text-gradient">
                Procrastinot
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Transform your productivity with AI-powered tools designed to help you
              beat procrastination and achieve your goals.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {['Features', 'Pricing', 'About', 'Contact', 'Privacy', 'Terms'].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="block text-white/70 hover:text-white text-sm transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex justify-center md:justify-start gap-4 mb-4">
              {socialLinks.map(({ icon: Icon, href, label, description }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={description}
                  title={description}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
            <p className="text-white/60 text-xs">
              Follow us for updates and productivity tips
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="text-white/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Procrastinot. Built with{' '}
            <motion.span
              className="inline-block text-red-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart size={14} className="inline" />
            </motion.span>{' '}
            by{' '}
            <a
              href="https://github.com/chethan-gen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Chethan Regala
            </a>.
          </div>

          <div className="text-white/50 text-xs flex items-center gap-2">
            <span>Powered by</span>
            <span className="text-primary-400">OpenAI</span>
            <span>·</span>
            <span className="text-secondary-400">React</span>
            <span>·</span>
            <span className="text-accent-400">TailwindCSS</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
