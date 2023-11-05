import { Helmet } from "react-helmet-async";

import { HeroSection } from "./sections/hero";
import { LogoCloudSection } from "./sections/logo-cloud";
import { StatisticsSection } from "./sections/statistics";

export const HomePage = () => (
  <main className="relative isolate mb-[400px] overflow-hidden bg-background">
    <Helmet>
      <title>Reactive Resume - A free and open-source resume builder</title>
    </Helmet>

    <HeroSection />
    <LogoCloudSection />
    <StatisticsSection />
  </main>
);
