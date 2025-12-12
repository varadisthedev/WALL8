import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { User, Briefcase, MapPin, Calendar, Wallet, TrendingUp, Edit2, Save, X, Mail, LogOut } from 'lucide-react';
import api from '../api/axios';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Profile = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [profileData, setProfileData] = useState(null);
    const [budgetData, setBudgetData] = useState(null);
    // ... rest of state

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [newBudget, setNewBudget] = useState('');
    const [formData, setFormData] = useState({
        age: '',
        institution: '',
        course: '',
        city: ''
    });

    const fetchData = async () => {
        if (!user) return;

        try {
            const res = await api.get('/user/profile');
            if (res.data.success) {
                setProfileData(res.data.data);
                setNewBudget(res.data.data.profile?.monthlyAllowance || 0);
                setFormData({
                    age: res.data.data.profile?.age || '',
                    institution: res.data.data.profile?.institution || '',
                    course: res.data.data.profile?.course || '',
                    city: res.data.data.profile?.city || ''
                });
            }

            // Fetch budget status
            const budgetRes = await api.get('/user/budget-status');
            if (budgetRes.data.success) {
                setBudgetData(budgetRes.data.data);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching profile", error);
            setError(`Failed to load profile: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleUpdateBudget = async () => {
        try {
            setLoading(true);
            const res = await api.put('/user/profile', {
                profile: {
                    ...profileData.profile,
                    monthlyAllowance: Number(newBudget)
                }
            });

            if (res.data.success) {
                await fetchData();
                setIsEditingBudget(false);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error updating budget", error);
            alert("Failed to update budget");
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const res = await api.put('/user/profile', {
                profile: {
                    ...profileData.profile,
                    ...formData,
                    age: Number(formData.age)
                }
            });

            if (res.data.success) {
                setProfileData(res.data.data);
                setIsEditingProfile(false);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile");
            setLoading(false);
        }
    };

    if (loading && !profileData) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-[var(--text-secondary)]">Loading profile...</div>
        </div>
    );

    if (error) return (
        <div className="glass-card p-6 bg-red-500/10 border-red-500/20">
            <p className="text-red-600">{error}</p>
        </div>
    );

    // Calculate budget percentage
    const spent = budgetData?.currentMonth?.total || 0;
    const allowance = profileData?.profile?.monthlyAllowance || 0;
    
    // Handle edge cases
    let remaining;
    let percentageUsed;
    let pieChartData;
    
    if (allowance === 0) {
        // No budget set - show spent as 100%
        remaining = 0;
        percentageUsed = 0;
        pieChartData = [spent > 0 ? spent : 0.01, 0.01];
    } else if (spent > allowance) {
        // Over budget - show overspending
        remaining = 0;
        percentageUsed = (spent / allowance) * 100;
        pieChartData = [spent, 0.01]; // Only show spent, minimal remaining for visual
    } else {
        // Normal case - within budget
        remaining = allowance - spent;
        percentageUsed = (spent / allowance) * 100;
        pieChartData = [spent > 0 ? spent : 0.01, remaining > 0 ? remaining : 0.01];
    }

    // Determine colors based on budget status
    const getChartColors = () => {
        if (spent > allowance) {
            // Over budget - use red for spent, light red for "remaining"
            return {
                spent: '#DC2626', // Red
                remaining: '#FCA5A5' // Light red
            };
        } else if (percentageUsed > 80) {
            // Near budget limit - use yellow/orange
            return {
                spent: '#F59E0B', // Orange
                remaining: '#BDD8E9' // Light blue
            };
        } else {
            // Normal - use requested blue colors
            return {
                spent: '#7BBDE8', // Medium blue
                remaining: '#BDD8E9' // Light blue
            };
        }
    };

    const colors = getChartColors();

    // Pie chart data with dynamic colors
    const pieData = {
        labels: spent > allowance ? ['Spent (Over Budget)', 'Budget'] : ['Spent', 'Remaining'],
        datasets: [{
            data: pieChartData,
            backgroundColor: [colors.spent, colors.remaining],
            borderColor: ['#1e293b', '#1e293b'],
            borderWidth: 2,
            hoverOffset: 8
        }]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { 
                    color: '#94a3b8',
                    font: { size: 12, weight: '500' },
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f1f5f9',
                bodyColor: '#cbd5e1',
                padding: 12,
                borderColor: '#475569',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        if (allowance === 0) {
                            return `${label}: ₹${value.toFixed(2)}`;
                        }
                        const percentage = ((value / (spent > allowance ? spent : allowance)) * 100).toFixed(1);
                        return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '65%'
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Profile Photo */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    {/* Profile Photo */}
                    <div className="relative">
                        <img 
                            src={user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || 'User')}&background=3b82f6&color=fff&size=128`} 
                            alt={profileData?.name || 'User'}
                            className="w-20 h-20 rounded-full border-4 border-blue-500/30 shadow-lg object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-[var(--glass-bg)] rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                            {profileData?.name || 'User'}
                        </h2>
                        <p className="text-[var(--text-secondary)] mt-1">Manage your account and budget settings</p>
                    </div>
                </div>

                <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-medium transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info Card - Spanning 2 columns */}
                <div className="lg:col-span-2 glass-card p-6 bg-gradient-to-br from-[#001D39]/30 to-[#0A4174]/20 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Personal Information
                        </h3>
                        {!isEditingProfile && (
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            <div className="px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] font-medium">
                                {profileData?.email || 'Not set'}
                            </div>
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Calendar className="w-4 h-4" />
                                Age
                            </label>
                            {isEditingProfile ? (
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="Enter your age"
                                    min="1"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] font-medium">
                                    {profileData?.profile?.age || 'Not set'}
                                </div>
                            )}
                        </div>

                        {/* Institution */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Briefcase className="w-4 h-4" />
                                Institution
                            </label>
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="Enter your institution"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] font-medium">
                                    {profileData?.profile?.institution || 'Not set'}
                                </div>
                            )}
                        </div>

                        {/* Course */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Briefcase className="w-4 h-4" />
                                Course
                            </label>
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={formData.course}
                                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="Enter your course"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] font-medium">
                                    {profileData?.profile?.course || 'Not set'}
                                </div>
                            )}
                        </div>

                        {/* City */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <MapPin className="w-4 h-4" />
                                City
                            </label>
                            {isEditingProfile ? (
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="Enter your city"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-[var(--text-primary)] font-medium">
                                    {profileData?.profile?.city || 'Not set'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save/Cancel Buttons for Profile */}
                    {isEditingProfile && (
                        <div className="flex gap-3 mt-6 pt-6 border-t border-[var(--glass-border)]">
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingProfile(false);
                                    setFormData({
                                        age: profileData?.profile?.age || '',
                                        institution: profileData?.profile?.institution || '',
                                        course: profileData?.profile?.course || '',
                                        city: profileData?.profile?.city || ''
                                    });
                                }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Budget Overview Card */}
                <div className="glass-card p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-purple-400" />
                            Budget Status
                        </h3>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-52 mb-4 relative">
                        <Doughnut data={pieData} options={pieOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-xs text-[var(--text-secondary)] font-medium">
                                {spent > allowance ? 'Over Budget' : allowance === 0 ? 'No Budget' : 'Used'}
                            </p>
                            <p className={`text-2xl font-bold ${
                                spent > allowance ? 'text-red-500' : 
                                percentageUsed > 80 ? 'text-yellow-500' : 
                                'text-[#7BBDE8]'
                            }`}>
                                {allowance === 0 ? '—' : `${percentageUsed.toFixed(0)}%`}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">Monthly Allowance</span>
                            <span className="text-lg font-bold text-[var(--text-primary)]">₹{allowance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">Spent</span>
                            <span className={`text-lg font-bold ${
                                spent > allowance ? 'text-red-500' : 
                                percentageUsed > 80 ? 'text-yellow-500' : 
                                'text-[#7BBDE8]'
                            }`}>
                                ₹{spent.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">Remaining</span>
                            <span className={`text-lg font-bold ${
                                spent > allowance ? 'text-red-500' : 
                                remaining <= 0 ? 'text-red-500' : 
                                'text-[#BDD8E9]'
                            }`}>
                                {spent > allowance ? `-₹${(spent - allowance).toFixed(2)}` : `₹${remaining.toFixed(2)}`}
                            </span>
                        </div>
                        {spent > allowance && (
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-xs text-red-500 font-semibold text-center">
                                    ⚠️ You've exceeded your budget by ₹{(spent - allowance).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget Management Card */}
                <div className="lg:col-span-3 glass-card p-6 bg-gradient-to-br from-[#49769F]/20 to-[#6EA2B3]/10 border border-blue-400/20">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        Budget Management
                    </h3>

                    {!isEditingBudget ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--text-secondary)] mb-1">Current Monthly Budget</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">₹{allowance.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => setIsEditingBudget(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                            >
                                <Edit2 className="w-4 h-4" />
                                Update Budget
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    New Monthly Budget (₹)
                                </label>
                                <input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all text-lg font-semibold"
                                    placeholder="Enter new budget"
                                    min="0"
                                    step="100"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleUpdateBudget}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditingBudget(false);
                                        setNewBudget(allowance);
                                    }}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
