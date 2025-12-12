import React, { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ErrorAlert } from "./ErrorAlert";
import { Wallet, Calendar, Target, LogOut, Edit2, X, Save } from "lucide-react";

export const Profile = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from backend
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            
            try {
                const res = await api.get('/user/profile');
                if (res.data.success) {
                  setProfileData(res.data.data);
                  setFormData(res.data.data.profile || {});
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile", error);
                console.error("Error response:", error.response);
                console.error("Error status:", error.response?.status);
                console.error("Error data:", error.response?.data);
                
                // If user not found (404), try to sync the user
                if (error.response?.status === 404) {
                    console.log("User not found, attempting to sync...");
                    console.log("User object:", user);
                    try {
                        console.log("Calling /user/sync with:", { clerkUser: user });
                        const syncRes = await api.post('/user/sync', { clerkUser: user });
                        console.log("Sync response:", syncRes.data);
                        
                        if (syncRes.data.success) {
                            // Check if profile is complete
                            if (!syncRes.data.data.profileCompleted) {
                                console.log("Profile incomplete, redirecting to onboarding");
                                navigate('/onboarding');
                            } else {
                                console.log("Profile complete, retrying fetch");
                                // Retry fetching profile
                                const retryRes = await api.get('/user/profile');
                                if (retryRes.data.success) {
                                    setProfileData(retryRes.data.data);
                                    setFormData(retryRes.data.data.profile || {});
                                }
                            }
                        }
                    } catch (syncError) {
                        console.error("Sync error:", syncError);
                        console.error("Sync error response:", syncError.response);
                        console.error("Sync error data:", syncError.response?.data);
                        setError(`Failed to initialize user profile: ${syncError.response?.data?.message || syncError.message}`);
                    }
                } else {
                    setError(`Failed to load profile: ${error.response?.data?.message || error.message}`);
                }
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error on edit
    };

    const handleSave = async () => {
        setError(null);
        setSuccessMsg(null);
        try {
            await api.put('/user/profile', { profile: formData });
            // Update local state to reflect changes immediately
            const updatedProfile = { ...profileData, profile: formData };
            setProfileData(updatedProfile);
            
            setIsEditing(false);
            setSuccessMsg("Profile updated successfully!");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (error) {
            console.error("Error updating profile", error);
            const msg = error.response?.data?.message || error.message || "Failed to update profile";
            setError(msg);
        }
    };

    if (!user) return null;
    
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div className="text-center p-10 text-[var(--text-secondary)]">
                    Loading your profile...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
             <div className="relative glass-card p-8 bg-[var(--glass-bg)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-80"></div>
                
                <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 mt-12">
                    <img 
                        src={user.imageUrl} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-[var(--bg-primary)] shadow-lg"
                    />
                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{user.fullName}</h2>
                        <p className="text-[var(--text-secondary)]">{user.primaryEmailAddress.emailAddress}</p>
                    </div>
                    <div className="md:ml-auto mb-2 flex items-center gap-3">
                        <SignOutButton>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg shadow-sm text-red-600 hover:bg-red-500/20 font-medium transition-colors">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </SignOutButton>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-lg shadow-sm text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] font-medium transition-colors"
                        >
                            {isEditing ? <><X className="w-4 h-4"/> Cancel</> : <><Edit2 className="w-4 h-4"/> Edit Profile</>}
                        </button>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="glass-card p-6 bg-[var(--glass-bg)] text-center">
                    <Wallet className="w-8 h-8 text-blue-500 mx-auto" />
                    <h3 className="text-[var(--text-secondary)] text-sm font-medium mt-2">Monthly Allowance</h3>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                        ₹{profileData?.budget?.monthlyLimit || '0'}
                    </p>
                </div>
                 <div className="glass-card p-6 bg-[var(--glass-bg)] text-center">
                    <Calendar className="w-8 h-8 text-blue-500 mx-auto" />
                    <h3 className="text-[var(--text-secondary)] text-sm font-medium mt-2">Member Since</h3>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="glass-card p-6 bg-[var(--glass-bg)] text-center">
                    <Target className="w-8 h-8 text-blue-500 mx-auto" />
                    <h3 className="text-[var(--text-secondary)] text-sm font-medium mt-2">Budget Status</h3>
                    <p className="text-lg font-semibold text-green-500">On Track</p>
                </div>
             </div>

             {/* Profile Details Form */}
             <div className="glass-card p-8 bg-[var(--glass-bg)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--glass-border)] pb-2">Personal Details</h3>
                
                {error && <ErrorAlert message={error} />}
                {successMsg && (
                    <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg border border-green-200">
                        {successMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Occupation / Student</label>
                        <input 
                            type="text" 
                            name="occupation" 
                            value={formData.occupation || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-[var(--input-bg)] border-blue-400 focus:ring-2 focus:ring-blue-300' : 'bg-[var(--input-bg)] border-[var(--glass-border)]'} outline-none text-[var(--text-primary)] transition-all`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Age</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-[var(--input-bg)] border-blue-400 focus:ring-2 focus:ring-blue-300' : 'bg-[var(--input-bg)] border-[var(--glass-border)]'} outline-none text-[var(--text-primary)] transition-all`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Institution</label>
                        <input 
                            type="text" 
                            name="institution" 
                            value={formData.institution || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-[var(--input-bg)] border-blue-400 focus:ring-2 focus:ring-blue-300' : 'bg-[var(--input-bg)] border-[var(--glass-border)]'} outline-none text-[var(--text-primary)] transition-all`}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Monthly Allowance (₹)</label>
                         <input 
                            type="number" 
                            name="monthlyAllowance" 
                            value={formData.monthlyAllowance || ''} 
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full p-3 rounded-lg border ${isEditing ? 'bg-[var(--input-bg)] border-blue-400 focus:ring-2 focus:ring-blue-300' : 'bg-[var(--input-bg)] border-[var(--glass-border)]'} outline-none text-[var(--text-primary)] transition-all`}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                )}
             </div>
        </div>
    );
};
