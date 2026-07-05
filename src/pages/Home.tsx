import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OverviewSection from "../sections/OverviewSection";
import HistoryChartSection from "../sections/HistoryChartSection";
import StakingDashboardSection from "../sections/StakingDashboardSection";
import UserDashboardSection from "../sections/UserDashboardSection";

interface HomeProps {
  scrollTo?: string;
}

export default function Home({ scrollTo }: HomeProps) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Normal landing - scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [scrollTo]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <main>
        <OverviewSection />
        <HistoryChartSection />
        <StakingDashboardSection />
        <UserDashboardSection />
      </main>
      <Footer />
    </div>
  );
}
