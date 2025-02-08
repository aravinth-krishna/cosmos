import styles from "./About.module.css";
import Image from "next/image";

import {
  FaRocket,
  FaTasks,
  FaChartBar,
  FaBrain,
  FaMobileAlt,
  FaUsers,
} from "react-icons/fa";

const About = () => {
  return (
    <section id={"about"} className={styles.about}>
      <div className={styles.aboutHero}>
        <div className={styles.aboutHeroText}>
          <h1>Cosmos: Project Management Reimagined</h1>
          <p>
            Welcome to Cosmos, where projects come to life with cutting-edge
            design and seamless collaboration. Experience innovation at its
            finest.
          </p>
        </div>
        <div className={styles.aboutHeroImage}>
          <Image
            src={"/about-image.jpg"}
            alt={"About Image"}
            width={600} // Set width to match CSS max-width for aspect ratio
            height={300} // Set height to match CSS height for aspect ratio
            className={styles.heroImg} // Add a className to style the Image component
          />
        </div>
      </div>
      <div className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Our Core Strengths</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <FaRocket />
            </div>
            <h3>Speed &amp; Innovation</h3>
            <p>Accelerate your projects with unmatched speed and innovation.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <FaTasks />
            </div>
            <h3>Intuitive Management</h3>
            <p>
              Experience a platform designed for effortless project tracking.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <FaChartBar />
            </div>
            <h3>Real-Time Analytics</h3>
            <p>Visualize progress with interactive charts and data insights.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <FaUsers />
            </div>
            <h3>Team Collaboration</h3>
            <p>Foster synergy and seamless communication among team members.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <FaBrain />
            </div>
            <h3>AI-Driven Insights</h3>
            <p>Utilize AI to predict outcomes and streamline your workflow.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <FaMobileAlt />
            </div>
            <h3>Mobile Optimized</h3>
            <p>
              Stay connected on any device with our fully responsive design.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
