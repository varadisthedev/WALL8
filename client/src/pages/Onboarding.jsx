// src/pages/Onboarding.jsx
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    monthlyAllowance: '',
    institution: '',
    course: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sync User first (just in case)
      await api.post('/user/sync', { clerkUser: user });

      // 2. Submit Onboarding Data
      const res = await api.post('/user/onboarding', {
        ...formData,
        age: Number(formData.age),
        monthlyAllowance: Number(formData.monthlyAllowance)
      });

      if (res.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Welcome & Context (Like HackerRank) */}
      <div className="w-1/2 p-16 flex flex-col justify-center bg-gray-50 border-r border-gray-100 hidden lg:flex">
         <div className="max-w-lg">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Hey, <br/>
                <span className="text-blue-600">{user?.firstName || 'Student'}</span>
            </h1>
            <p className="text-xl text-gray-500 mb-12 leading-relaxed">
                Help us personalize your financial journey by telling us a bit about yourself.
            </p>

            <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Track your daily expenses effortlessly</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Get AI-powered budget suggestions</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Visualize spending habits</span>
                </div>
            </div>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">I am here to...</h2>
            <p className="text-gray-500 mb-10">Set up my student budget profile.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                        <input
                            type="number"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            placeholder="20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Allowance</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-gray-400 font-medium">₹</span>
                            <input
                                type="number"
                                required
                                className="w-full p-4 pl-8 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                                value={formData.monthlyAllowance}
                                onChange={(e) => setFormData({ ...formData, monthlyAllowance: e.target.value })}
                                placeholder="5000"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution / College</label>
                    <input
                        type="text"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. IIT Bombay"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            placeholder="B.Tech"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Mumbai"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all mt-8 transform hover:-translate-y-0.5"
                >
                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
