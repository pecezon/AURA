import LandingAbout from "../components/landing/landing-about";
import LandingCTA from "../components/landing/landing-cta";
import LandingLayers from "../components/landing/landing-layers";
import LandingNavbar from "../components/landing/landing-navbar";
import LandingRoles from "../components/landing/landing-roles";
import LandingRules from "../components/landing/landing-rules";
import LandingScore from "../components/landing/landing-score";
import LandingStats from "../components/landing/landing-stats";

export default function Landing() {
  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-100">

        <LandingNavbar />

        <LandingAbout />

        <LandingStats />

        <LandingLayers />

        <LandingRoles />

        <LandingScore />

        <LandingRules />

        <LandingCTA />
    </div>
  );
}
