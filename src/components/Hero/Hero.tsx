import styles from "./Hero.module.css";
import GetStartedButton from "@/components/GetStartedButton/GetStartedButton";

const Hero = () => {
  return (
    <section id={"home"} className={styles.hero}>
      <div className={styles.content}>
        <h1>Cosmos: Your Next-Generation Project Management Platform</h1>
        <p>
          Revolutionize the way you manage projects with AI-powered insights,
          interactive timelines, and seamless collaboration.
        </p>
      </div>
      <div>
        <GetStartedButton />
      </div>
    </section>
  );
};

export default Hero;
