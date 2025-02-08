import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Features from "@/components/Features/Features";
import Docs from "@/components/Docs/Docs";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Hero />
        <About />
        <Features />
        <Docs />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
