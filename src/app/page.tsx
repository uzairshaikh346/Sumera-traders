"use client";
import HeroCarousel from "./components/HeroCarousel";
import ImageSwitcher from "./components/ImageSwitcher";
import WelcomeSection from "./components/WelcomeSection";


export default function Home() {
  return (
    <>
      <HeroCarousel />
      <WelcomeSection />
      <ImageSwitcher />
    </>
  );
}