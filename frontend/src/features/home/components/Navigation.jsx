'use client';

import Link from 'next/link';
import { MdBusiness, MdDoorFront, MdDevices } from 'react-icons/md';
import styles from './Navigation.module.css';

const navItems = [
  { href: '/buildings',                 label: 'Budovy',   Icon: MdBusiness },
  { href: '/buildings/favourite/doors', label: 'Oblíbené', Icon: MdDoorFront },
  { href: '/devices',                   label: 'Zařízení', Icon: MdDevices },
];

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      {navItems.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={styles.link}>
          <Icon className={styles.icon} />
          <span className={styles.label}>{label}</span>
        </Link>
      ))}
    </nav>
  );
}