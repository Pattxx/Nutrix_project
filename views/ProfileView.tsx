import React, { useState } from "react";
import { Flame } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";
import { UserProfile } from "../types";
import { updateUserProfile } from "../app_services/profile.service";

const ProfileView: React.FC = () => {
    const { currentUser, setCurrentUser, setView, calculateDailyTarget, activityLevels } = useNutrix();
    const [formData, setFormData] = useState<UserProfile>(currentUser || ({} as UserProfile));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!currentUser) return null;

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        setError(null);
        setLoading(true);
        try {
            const updated = await updateUserProfile(currentUser.email, formData);
            setCurrentUser(updated);
            setView('dashboardView');
        } catch (err) {
            console.error("Save profile failed:", err);
            setError(err instanceof Error ? err.message : "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-left-4 duration-500">

            {/* Form */}
            <div>
                <h2 className="text-3xl font-bold">My Profile</h2>
                <p className="text-slate-500 mb-6">Calculate your Mifflin St Jeor target.</p>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                            <input
                                type="number"
                                value={formData.age || ''}
                                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.weight || ''}
                                onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Height */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.height || ''}
                                onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                            <select
                                value={formData.gender || 'male'}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Goal */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Goal</label>
                            <select
                                value={formData.goal || 'maintain'}
                                onChange={(e) => handleChange('goal', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="lose">Lose Weight</option>
                                <option value="maintain">Maintain</option>
                                <option value="gain">Gain Weight</option>
                            </select>
                        </div>

                        {/* Activity Level */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
                            <select
                                value={formData.activityLevel || 'light'}
                                onChange={(e) => handleChange('activityLevel', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="sedentary">Sedentary (little or no exercise)</option>
                                <option value="light">Light (exercise 1-3 days/week)</option>
                                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                                <option value="active">Active (exercise 6-7 days/week)</option>
                                <option value="veryActive">Very Active (intense exercise daily)</option>
                            </select>
                        </div>
                    </div>

                    {/* Calculated Target */}
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
                        <div>
                            <p className="text-emerald-700 font-bold uppercase text-xs tracking-widest mb-1">
                                Calculated Daily Limit
                            </p>
                            <p className="text-3xl font-black text-emerald-800">{calculateDailyTarget(formData)} kcal</p>
                        </div>
                        <Flame className="w-12 h-12 text-emerald-600 opacity-20" />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`mt-8 w-full py-4 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-100 ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">What is  Mifflin St Jeor method? </h2>
                <p className="text-slate-500">
                    a widely used, accurate, and scientifically validated formula developed in 1990 to estimate a person's Basal Metabolic Rate (BMR). 
                    It calculates daily calories burned at rest, considering age, sex, weight, and height. 
                    It is highly regarded for its accuracy in both obese and non-obese individuals. 
                </p>
            </div>
        </div>
    );
};

export default ProfileView;
