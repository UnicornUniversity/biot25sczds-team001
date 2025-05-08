'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  FiShield,
  FiMenu,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiHome,
  FiBookOpen,
  FiHeart,
  FiCpu
} from 'react-icons/fi';
import { useAuth } from '@/lib/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const modeParam    = searchParams.get('mode') || 'login';
  const { user, logout } = useAuth();

  // flag, abychom věděli, že jsme se již zhydratovali na klientu
  const [mounted, setMounted] = useState(false);

  // dropdowny
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const menuRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    // až klient, označím mounted
    setMounted(true);

    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/',                          label: 'Domů',     Icon: FiHome     },
    { href: '/buildings',                 label: 'Budovy',   Icon: FiBookOpen },
    { href: '/buildings/favourite/doors', label: 'Oblíbené', Icon: FiHeart    },
    { href: '/devices',                   label: 'Zařízení', Icon: FiCpu      },
  ];

  const handleLogout = () => {
    logout();
    router.push('/auth?mode=login');
  };

  // Guest button: pokud jsme na /auth?mode=login → nabídni registraci, jinak přihlášení
  const guestHref  = pathname === '/auth' && modeParam === 'login'
    ? '/auth?mode=register'
    : '/auth?mode=login';
  const guestLabel = pathname === '/auth' && modeParam === 'login'
    ? 'Registrovat se'
    : 'Přihlásit se';

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <FiShield className={styles.brandIcon} />
        <span className={styles.brandText}>DoorGuardian</span>
      </Link>

      <div className={styles.controls}>
        {mounted && user ? (
          <>
            {/* Jméno uživatele */}
            <span className={styles.userName}>
              <FiUser className={styles.userIcon} /> {user.name}
            </span>

            {/* navigační menu */}
            <div ref={menuRef} className={styles.menuWrapper}>
              <button
                className={styles.menuBtn}
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Otevřít navigaci"
              >
                <FiMenu className={styles.menuIcon} />
              </button>
              {menuOpen && (
                <ul className={styles.dropdown}>
                  {navItems.map(({ href, label, Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={styles.dropdownLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Icon className={styles.dropdownIcon} />
                        <span className={styles.dropdownLabel}>{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* uživatelské menu */}
            <div ref={userRef} className={styles.menuWrapper}>
              <button
                className={styles.userBtn}
                onClick={() => setUserOpen(o => !o)}
                aria-label="Uživatelské menu"
              >
                <FiChevronDown
                  className={`${styles.chevron} ${userOpen ? styles.rotate : ''}`}
                />
              </button>
              {userOpen && (
                <ul className={styles.dropdown}>
                  <li>
                    <button className={styles.dropdownLink} onClick={handleLogout}>
                      <FiLogOut className={styles.dropdownIcon} />
                      <span className={styles.dropdownLabel}>Odhlásit se</span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : (
          // fallback pro SSR i do doby, než se zjistí `user` na klientu
          <Link href={guestHref} className={styles.loginLink}>
            {guestLabel}
          </Link>
        )}
      </div>
    </header>
  );
}