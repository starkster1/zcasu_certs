import React from "react";
import styles from "./Features.module.css"; // Import the CSS module
import { Shield, GraduationCap, FileCheck, Share2 } from "lucide-react";

const features = [
  {
    name: "Secure Storage",
    description:
      "Certificates are securely stored on the blockchain and IPFS, ensuring immutability and authenticity.",
    icon: Shield,
  },
  {
    name: "Easy Verification",
    description:
      "Instant certificate validation through smart contracts on the Ethereum blockchain.",
    icon: FileCheck,
  },
  {
    name: "Institution Integration",
    description:
      "Seamless connection between students and ZCAS University.",
    icon: GraduationCap,
  },
  {
    name: "Controlled Sharing",
    description:
      "Grant temporary access to your certificates with precise control over duration and permissions.",
    icon: Share2,
  },
];

const Features = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={styles.textCenter}>
          <h2 className={styles.heading}>
            Secure Certificate Management Made Simple
          </h2>
          <p className={styles.subheading}>
            Our blockchain-powered platform ensures your certificates are
            secure, verifiable, and easily accessible.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.name} className={styles.featureItem}>
              <div className={styles.iconWrapper}>
                <feature.icon className={styles.icon} aria-hidden="true" />
              </div>
              <div>
                <h3 className={styles.featureName}>{feature.name}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
