'use client';

import Link from 'next/link';
import {
  FiGithub,
  FiMail,
  FiInfo,
} from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />
      <div className={styles.content}>
        <span>© 2025 DoorGuardian</span>
        <div className={styles.links}>
          <Link href="https://github.com/your-org/doorguardian" target="_blank" className={styles.link}>
            <FiGithub className={styles.icon} />
            GitHub
          </Link>
          <Link href="/help" className={styles.link}>
            <FiInfo className={styles.icon} />
            Nápověda
          </Link>
          <Link href="mailto:support@doorguardian.com" className={styles.link}>
            <FiMail className={styles.icon} />
            Kontakt
          </Link>
        </div>
      </div>
    </footer>
  );
}