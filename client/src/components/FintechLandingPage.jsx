import React from 'react';
import LandingNavbar from './Landingnavbar';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import Footer from './Footer';

export const FintechLandingPage = () => {
  return (
    <div className="antialiased font-sans bg-gray-50">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default FintechLandingPage;

