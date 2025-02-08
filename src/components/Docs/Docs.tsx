import styles from "./Docs.module.css";
import Link from "next/link";

const Docs = () => {
  return (
    <section id={"docs"} className={styles.docsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Explore Our Documentation</h2>
          <p className={styles.introText}>
            Dive into our comprehensive documentation to understand every aspect
            of Cosmos. From quick start guides to in-depth API references,
            you&apos;ll find everything you need to get the most out of Cosmos
            and integrate it into your workflow.
          </p>
        </div>
        <div className={styles.docsContent}>
          <p className={styles.contentText}>
            Our documentation is hosted on GitHub for transparency and community
            contributions. Click the button below to visit our GitHub
            documentation page and explore guides, tutorials, and API details.
          </p>
          <div className={styles.docsButton}>
            <Link
              href="https://www/github.com/aravinth-krishna/cosmos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className={styles.githubButton}>
                View Documentation on GitHub
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Docs;
