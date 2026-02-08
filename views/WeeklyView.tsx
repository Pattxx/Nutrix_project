import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNutrix } from "../context/NutrixContext";
import { fetchWeeklyStats } from "../app_services/history.service";

const WeeklyView: React.FC = () => {
    const { currentUser, dailyTarget } = useNutrix();
    const [weeklyData, setWeeklyData] = useState<Array<{ date: string; calories: number }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWeekly = async () => {
            if (!currentUser || !currentUser.email) return;
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWeeklyStats(currentUser.email);
                console.log("Weekly stats:", data);
                setWeeklyData(data);
            } catch (err) {
                console.error("Failed to load weekly stats:", err);
                setError(err instanceof Error ? err.message : "Failed to load weekly data");
            } finally {
                setLoading(false);
            }
        };
        loadWeekly();
    }, [currentUser]);

    if (!currentUser) return null;

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const chartData = weeklyData.map(entry => ({
        ...entry,
        displayDate: formatDate(entry.date),
        target: dailyTarget
    }));

    // Calculate weekly totals
    const totalWeekly = weeklyData.reduce((sum, day) => sum + day.calories, 0);
    const avgDaily = weeklyData.length > 0 ? Math.round(totalWeekly / weeklyData.length) : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold">Weekly Consumption</h2>
            <p className="text-slate-500">Last 7 days of calorie intake tracking.</p>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading weekly data...</div>
            ) : weeklyData.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No consumption data yet. Add meals to see weekly stats.</div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Total Week</p>
                            <p className="text-3xl font-black text-emerald-600">{totalWeekly.toLocaleString()}</p>
                            <p className="text-xs text-slate-400 mt-1">kcal</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Daily Average</p>
                            <p className="text-3xl font-black text-blue-600">{avgDaily.toLocaleString()}</p>
                            <p className="text-xs text-slate-400 mt-1">kcal/day</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Daily Target</p>
                            <p className="text-3xl font-black text-purple-600">{dailyTarget.toLocaleString()}</p>
                            <p className="text-xs text-slate-400 mt-1">kcal/day</p>
                        </div>
                    </div>

                    {/* Weekly Chart */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">Daily Calorie Intake</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="displayDate" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                    }}
                                    labelStyle={{ color: '#e2e8f0' }}
                                    formatter={(value: any) => value.toLocaleString()}
                                />
                                <Legend />
                                <Bar dataKey="calories" fill="#10b981" name="Calories Eaten" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="target" fill="#a78bfa" name="Daily Target" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Daily Breakdown Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Date</th>
                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Calories</th>
                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">vs Target</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.map((day) => (
                                    <tr key={day.date} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                        <td className="p-4 font-semibold">{day.displayDate}</td>
                                        <td className="p-4 text-right font-bold text-emerald-600">{day.calories.toLocaleString()} kcal</td>
                                        <td className="p-4 text-right text-sm">
                                            {day.calories >= day.target ? (
                                                <span className="text-red-600">+{(day.calories - day.target).toLocaleString()}</span>
                                            ) : (
                                                <span className="text-blue-600">-{(day.target - day.calories).toLocaleString()}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default WeeklyView;
