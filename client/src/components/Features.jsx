import React from 'react';
import { FEATURES_DATA } from './data';

export const Features = () => (
  <section id="features" className="py-20 bg-gray-800">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center text-gray-100 mb-4">Unmatched Financial Power</h2>
      <p className="text-lg text-center text-gray-400 mb-12 max-w-2xl mx-auto">We combine cutting-edge technology with intuitive design to give you complete control over your money.</p>

      <div className="grid md:grid-cols-3 gap-8">
        {FEATURES_DATA.map((f, i) => (
          <div key={i} className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 hover:border-teal-500 transition duration-300">
            <div className="text-4xl text-teal-400 mb-4 w-12 h-12 flex items-center justify-center bg-teal-500/20 rounded-lg">{f.icon}</div>
            <h3 className="text-xl font-semibold text-gray-100 mb-3">{f.title}</h3>
            <p className="text-gray-400">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
