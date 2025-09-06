import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.brandSection}>
            <h3 className={`heading-md ${styles.brandName}`}>
              <span className="text-gradient">Procrastinot</span>
            </h3>
            <p className={`text-sm ${styles.brandTagline}`}>
              Master your mind, master your time
            </p>
            <div className={styles.samuraiAccent}>
              <div className={styles.accentLine}></div>
              <div className={styles.accentDot}></div>
              <div className={styles.accentLine}></div>
            </div>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Product</h4>
              <ul className={styles.linkList}>
                <li><a href="#features" className={styles.link}>Features</a></li>
                <li><a href="#pricing" className={styles.link}>Pricing</a></li>
                <li><a href="#demo" className={styles.link}>Demo</a></li>
                <li><a href="#download" className={styles.link}>Download</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Company</h4>
              <ul className={styles.linkList}>
                <li><a href="#about" className={styles.link}>About</a></li>
                <li><a href="#blog" className={styles.link}>Blog</a></li>
                <li><a href="#careers" className={styles.link}>Careers</a></li>
                <li><a href="#contact" className={styles.link}>Contact</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Support</h4>
              <ul className={styles.linkList}>
                <li><a href="#help" className={styles.link}>Help Center</a></li>
                <li><a href="#community" className={styles.link}>Community</a></li>
                <li><a href="#privacy" className={styles.link}>Privacy</a></li>
                <li><a href="#terms" className={styles.link}>Terms</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.socialSection}>
            <h4 className={styles.socialTitle}>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="#twitter" className={styles.socialLink} aria-label="Twitter">
                <div className={styles.socialIcon}>
                  <div className={styles.twitterIcon}></div>
                </div>
              </a>
              <a href="#github" className={styles.socialLink} aria-label="GitHub">
                <div className={styles.socialIcon}>
                  <div className={styles.githubIcon}></div>
                </div>
              </a>
              <a href="#linkedin" className={styles.socialLink} aria-label="LinkedIn">
                <div className={styles.socialIcon}>
                  <div className={styles.linkedinIcon}></div>
                </div>
              </a>
              <a href="#discord" className={styles.socialLink} aria-label="Discord">
                <div className={styles.socialIcon}>
                  <div className={styles.discordIcon}></div>
                </div>
              </a>
            </div>
            <div className={styles.contactInfo}>
              <p className={styles.email}>hello@procrastinot.com</p>
              <p className={styles.location}>Built with discipline</p>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p className={styles.copyrightText}>
              © {currentYear} Procrastinot. All rights reserved.
            </p>
          </div>
          <div className={styles.philosophy}>
            <p className={styles.philosophyText}>
              "The way of the warrior is to stop trouble before it starts" - Miyamoto Musashi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;