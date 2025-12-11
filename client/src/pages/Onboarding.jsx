// src/pages/Onboarding.jsx
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
      await api.post('/user/sync', {
        clerkUser: user
      });

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome, {user?.firstName}!
        </h2>
        <p className="text-gray-400 mb-6">Let's set up your profile to manage your finances better.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Monthly Allowance (₹)</label>
            <input
              type="number"
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.monthlyAllowance}
              onChange={(e) => setFormData({ ...formData, monthlyAllowance: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Institution / College</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
