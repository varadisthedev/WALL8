import React from 'react';
import { CTAButton } from './data';

export const Hero = () => {
  return (
    <section className="bg-gray-900 pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-teal-900 opacity-10 rounded-full filter blur-3xl" aria-hidden="true"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-100 leading-tight mb-4">
              <span className="text-teal-400">Future-Proof</span> Your Finances
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-lg lg:max-w-none mx-auto lg:mx-0">
              The next-generation platform for banking, budgeting, and building wealth, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <CTAButton>Get Started Free</CTAButton>
              <CTAButton primary={false}>Explore Demo</CTAButton>
            </div>
          </div>

          {/* 3D area: replace the inner div with your Spline/Dora iframe or react-three-fiber */}
          <div className="flex justify-center items-center h-80 lg:h-full">
            <div className="w-full max-w-md h-full bg-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-teal-500/50">
              <p className="text-gray-400 text-center p-4">[Space for 3D Animation / Illustration]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
