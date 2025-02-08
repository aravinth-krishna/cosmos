import React from "react";
import styles from "./Features.module.css";
import {
  FaRocket,
  FaTasks,
  FaChartBar,
  FaBrain,
  FaMobileAlt,
  FaUsers,
  FaClock,
  FaCode,
  FaShareAlt,
} from "react-icons/fa";

// Define your features data.
const featuresData = [
  {
    icon: <FaRocket />,
    title: "Secure Authentication",
    description:
      "Robust JWT/Bcrypt security for seamless access and protection.",
  },
  {
    icon: <FaTasks />,
    title: "Task Management",
    description:
      "Intuitive tools for project planning, tracking, and execution.",
  },
  {
    icon: <FaChartBar />,
    title: "Interactive Charts",
    description: "Dynamic visualizations to monitor progress and performance.",
  },
  {
    icon: <FaUsers />,
    title: "Team Collaboration",
    description: "Foster seamless communication among team members.",
  },
  {
    icon: <FaBrain />,
    title: "AI-Powered Insights",
    description: "Leverage smart analytics for better project decision-making.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Responsive Design",
    description: "Optimized for all devices, ensuring a smooth experience.",
  },
  {
    icon: <FaClock />,
    title: "Deadline Management",
    description: "Set and track milestones with automated reminders.",
  },
  {
    icon: <FaCode />,
    title: "API Access",
    description:
      "Integrate Cosmos with your favorite tools via our robust API.",
  },
  {
    icon: <FaShareAlt />,
    title: "Export & Reporting",
    description: "Generate detailed reports and export data effortlessly.",
  },
];

// Split the cards into two groups (for example, alternate cards).
const topFeatures = featuresData.filter((_, index) => index % 2 === 0);
const bottomFeatures = featuresData.filter((_, index) => index % 2 !== 0);

const Features = () => {
  return (
    <section id={"features"} className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Discover Cosmos Features</h2>
          <p className={styles.introText}>
            Explore a suite of tools designed to transform your project
            management experience.
          </p>
        </div>

        <div className={styles.carouselWrapper}>
          {/* Top carousel – slides from left to right */}
          <div className={styles.topCarousel}>
            <div className={styles.carouselInnerLeftToRight}>
              {topFeatures.map((feature, index) => (
                <div
                  className={styles.featureCard}
                  key={`top-feature-${index}`}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                  <p className={styles.featureCardDescription}>
                    {feature.description}
                  </p>
                </div>
              ))}
              {/* Duplicate the cards for seamless looping */}
              {topFeatures.map((feature, index) => (
                <div
                  className={styles.featureCard}
                  key={`top-feature-dup-${index}`}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                  <p className={styles.featureCardDescription}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom carousel – slides from right to left */}
          <div className={styles.bottomCarousel}>
            <div className={styles.carouselInnerRightToLeft}>
              {bottomFeatures.map((feature, index) => (
                <div
                  className={styles.featureCard}
                  key={`bottom-feature-${index}`}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                  <p className={styles.featureCardDescription}>
                    {feature.description}
                  </p>
                </div>
              ))}
              {bottomFeatures.map((feature, index) => (
                <div
                  className={styles.featureCard}
                  key={`bottom-feature-dup-${index}`}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                  <p className={styles.featureCardDescription}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
