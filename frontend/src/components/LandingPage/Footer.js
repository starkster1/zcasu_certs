import React from "react";
import styles from "./Footer.module.css";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo and description */}
          <div>
            <div className={styles.brand}>
              <Shield className={styles.icon} />
              <span className={styles.brandName}>ZCASU-Certs</span>
            </div>
            <p className={styles.description}>
              Secure, blockchain-based certificate management system for
              educational institutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.heading}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="#" className={styles.link}>
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className={styles.link}>
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className={styles.link}>
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className={styles.link}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className={styles.heading}>Contact Us</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                information@zcas.edu.zm
              </li>
              <li className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                +260 211 232093 / 95
              </li>
              <li className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                Dedan Kimathi Road <br />
                P O Box 35243 <br />
                Lusaka - Zambia
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={styles.heading}>Newsletter</h3>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for updates and news.
            </p>
            <form className={styles.form}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} ZCAS University. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
