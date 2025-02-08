"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavbarLink {
  name: string;
  path: string;
}

const navLinks: NavbarLink[] = [
  { name: "Home", path: "/#home" },
  { name: "About", path: "/#about" },
  { name: "Features", path: "/#features" },
  { name: "Docs", path: "/#docs" },
  { name: "Pricing", path: "/#pricing" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            COSMOS
          </Link>
        </div>

        <div className={styles.center}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.right}>
          <Link href="/signin" className={styles.authLink}>
            Sign In
          </Link>
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <FaTimes className={styles.icon} />
            ) : (
              <FaBars className={styles.icon} />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.path} onClick={closeMenu}>
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/signin" onClick={closeMenu}>
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
