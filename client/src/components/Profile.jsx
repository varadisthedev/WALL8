import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import api from "../api/axios";

export const Profile = () => {
    const { user } = useUser();
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Fetch user profile from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/user/profile');
                if (res.data.success) {
                  setProfileData(res.data.data);
                  setFormData(res.data.data.profile || {});
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await api.put('/user/profile', { profile: formData });
            setProfileData({ ...profileData, profile: formData });
            setIsEditing(false);
            alert("Profile updated!");
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile");
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
             <div className="relative glass-card p-8 bg-white/70 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-400 to-amber-300 opacity-80"></div>
                
                <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 mt-12">
                    <img 
                        src={user.imageUrl} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                        <p className="text-gray-500">{user.primaryEmailAddress.emailAddress}</p>
                    </div>
                    <div className="md:ml-auto mb-2">
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="glass-card p-6 bg-white/60 text-center">
                    <span className="text-3xl">💰</span>
                    <h3 className="text-gray-500 text-sm font-medium mt-2">Monthly Allowance</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        ₹{profileData?.budget?.monthlyLimit || '0'}
                    </p>
                </div>
                 <div className="glass-card p-6 bg-white/60 text-center">
                    <span className="text-3xl">📅</span>
                    <h3 className="text-gray-500 text-sm font-medium mt-2">Member Since</h3>
                    <p className="text-lg font-semibold text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="glass-card p-6 bg-white/60 text-center">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-gray-500 text-sm font-medium mt-2">Budget Status</h3>
                    <p className="text-lg font-semibold text-green-600">On Track</p>
                </div>
             </div>

             {/* Profile Details Form */}
             <div className="glass-card p-8 bg-white/80">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Occupation / Student</label>
                        <input 
                            type="text" 
                            name="occupation" 
                            value={formData.occupation || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-white border-orange-300 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50 border-gray-200'} outline-none transition-all`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-white border-orange-300 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50 border-gray-200'} outline-none transition-all`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Institution</label>
                        <input 
                            type="text" 
                            name="institution" 
                            value={formData.institution || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-white border-orange-300 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50 border-gray-200'} outline-none transition-all`}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Monthly Allowance (₹)</label>
                         <input 
                            type="number" 
                            name="monthlyAllowance" 
                            value={formData.monthlyAllowance || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-white border-orange-300 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50 border-gray-200'} outline-none transition-all`}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
             </div>
        </div>
    );
};
