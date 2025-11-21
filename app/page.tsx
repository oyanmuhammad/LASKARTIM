import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CollaborationSection } from "@/components/collaboration-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { MissionSection } from "@/components/mission-section";
import { ProfileSection } from "@/components/profile-section";
import { LocationSection } from "@/components/location-section";
import { CTASection } from "@/components/cta-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CollaborationSection />
      <FeaturesSection />
      <TestimonialSection />
      <MissionSection />
      <ProfileSection />
      <LocationSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  );
}
