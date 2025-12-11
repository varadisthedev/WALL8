import React from 'react';
import { TESTIMONIALS_DATA } from './data';

export const Testimonials = () => (
  <section className="py-20 bg-gray-50" id="testimonials">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">What Our Users Say</h2>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">Hear from thousands of people who are already transforming their financial lives.</p>

      <div className="grid lg:grid-cols-2 gap-10">
        {TESTIMONIALS_DATA.map((t, i) => (
          <figure key={i} className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
            <blockquote className="text-gray-700 italic mb-6">"{t.quote}"</blockquote>
            <figcaption className="flex items-center space-x-4">
              <img src={t.avatar} alt={`Avatar of ${t.name}`} className="w-14 h-14 rounded-full object-cover border-2 border-teal-500" />
              <div><div className="font-semibold text-gray-900">{t.name}</div><div className="text-sm text-gray-500">{t.title}</div></div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
