import React from "react";
import { Flame } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";

const ProfileView: React.FC = () => {
    const { currentUser, setCurrentUser, setView, calculateDailyTarget, ACTIVITY_LEVELS } = useNutrix();

    if (!currentUser) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-left-4 duration-500">

            {/* Form */}
            <div>
                <h2 className="text-3xl font-bold">My Profile</h2>
                <p className="text-slate-500 mb-6">Calculate your Mifflin�St Jeor target.</p>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Name, Age, Weight, Height, Gender, Goal, Activity Level */}
                        {/* Copy inputs from your App.js snippet */}
                    </div>

                    {/* Calculated Target */}
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
                        <div>
                            <p className="text-emerald-700 font-bold uppercase text-xs tracking-widest mb-1">
                                Calculated Daily Limit
                            </p>
                            <p className="text-3xl font-black text-emerald-800">{calculateDailyTarget(currentUser)} kcal</p>
                        </div>
                        <Flame className="w-12 h-12 text-emerald-600 opacity-20" />
                    </div>

                    <button
                        onClick={() => setView('dashboardView')}
                        className="mt-8 w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                    >
                        Save Profile
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">What is  Mifflin�St Jeor method? </h2>
                <p className="text-slate-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue purus, commodo et ex sagittis, feugiat mollis felis...
                </p>
            </div>
        </div>
    );
};

export default ProfileView;
