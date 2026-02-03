import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Flame } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";

const DashboardView: React.FC = () => {
    const { currentUser, setView, dailyTarget, totals, macroData, todayLogs } = useNutrix();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Welcome & Goal */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Welcome back, {currentUser?.name}!</h2>
                    <p className="text-slate-500">Here's your progress for today.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <Flame className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Goal</p>
                        <p className="text-xl font-bold">{dailyTarget} kcal</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Calories Pie */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="relative w-24 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Consumed', value: Math.min(totals.calories, dailyTarget) },
                                        { name: 'Remaining', value: Math.max(0, dailyTarget - totals.calories) }
                                    ]}
                                    innerRadius={30}
                                    outerRadius={45}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f1f5f9" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-sm font-bold">{Math.round((totals.calories / dailyTarget) * 100)}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium">Calories</h3>
                        <p className="text-2xl font-bold">{totals.calories}</p>
                        <p className="text-xs text-slate-400">of {dailyTarget} limit</p>
                    </div>
                </div>

                {/* Macro Bars */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-4">Macronutrients (g)</h3>
                    <div className="flex justify-around items-end h-32">
                        {macroData.map(m => (
                            <div key={m.name} className="flex flex-col items-center gap-2">
                                <div
                                    className="w-8 rounded-t-lg transition-all duration-700"
                                    style={{ height: `${Math.min(100, (m.value / 1.5))}%`, backgroundColor: m.color }}
                                />
                                <span className="text-xs font-bold">{m.value}g</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{m.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/*Log*/}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium mb-2">Today's Log</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {todayLogs.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">No food logged yet.</p>
                        ) : (
                            todayLogs.map(log => (
                                <div key={log.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                                    <div>
                                        <p className="font-semibold">{log.name}</p>
                                        <p className="text-xs text-slate-400">{log.grams}g</p>
                                    </div>
                                    <span className="font-bold text-emerald-600">+{log.calories}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        onClick={() => setView('pantry')}
                        className="mt-4 w-full py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition"
                    >
                        Add Entry
                    </button>
                </div>

            </div>

            {/* Weekly Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-6">Weekly Consumption</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ day: 'Today', calories: totals.calories }, { day: 'Avg', calories: dailyTarget }]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default DashboardView;
