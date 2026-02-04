import React from "react";
import { Flame } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";
import { INITIAL_FOOD_DATABASE, ACTIVITY_LEVELS } from '../constants';
const ProfileView: React.FC = () => {
    const { currentUser, setCurrentUser, setView, calculateDailyTarget, activityLevels } = useNutrix();

    if (!currentUser) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-left-4 duration-500">
            {/* Form */}
            <div>
                <h2 className="text-3xl font-bold">My Profile</h2>
                <p className="text-slate-500 mb-6">Calculate your Mifflin St Jeor target.</p>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                       
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentUser.name}
                                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            />
                        </div>

                       
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentUser.age}
                                onChange={(e) => setCurrentUser({ ...currentUser, age: parseInt(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentUser.gender}
                                onChange={(e) => setCurrentUser({ ...currentUser, gender: e.target.value as any })}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                      
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentUser.weight}
                                onChange={(e) => setCurrentUser({ ...currentUser, weight: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentUser.height}
                                onChange={(e) => setCurrentUser({ ...currentUser, height: parseFloat(e.target.value) })}
                            />
                        </div>

                     
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Fitness Goal</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentUser.goal}
                                onChange={(e) => setCurrentUser({ ...currentUser, goal: e.target.value as any })}
                            >
                                <option value="lose">Weight Loss (-500 kcal)</option>
                                <option value="maintain">Maintenance</option>
                                <option value="gain">Muscle Gain (+500 kcal)</option>
                            </select>
                        </div>

                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Activity Level</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                value={currentUser.activityLevel}
                                onChange={(e) =>
                                    setCurrentUser({
                                        ...currentUser,
                                        activityLevel: parseFloat(e.target.value) as any,
                                    })
                                }
                            >
                                {ACTIVITY_LEVELS.map((a) => (
                                    <option key={a.value} value={a.value}>
                                        {a.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>




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
                
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">What is  Mifflin St Jeor method? </h2>
                    <p className="text-slate-500">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue purus, commodo et ex sagittis, feugiat mollis felis...
                    </p>
                </div>
        </div>
    );
};

export default ProfileView;
