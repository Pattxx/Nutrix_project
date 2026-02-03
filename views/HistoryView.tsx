import React from "react";
import { useNutrix } from "../context/NutrixContext";

const HistoryView: React.FC = () => {
    const { mealLogs } = useNutrix();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold">Consumption History</h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Date</th>
                            <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Food Item</th>
                            <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Amount</th>
                            <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Calories</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mealLogs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-slate-400 italic">No history available.</td>
                            </tr>
                        ) : (
                            mealLogs.map(log => (
                                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="p-4 text-sm text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4 font-semibold">{log.name}</td>
                                    <td className="p-4 text-sm">{log.grams}g</td>
                                    <td className="p-4 font-bold text-emerald-600 text-right">{log.calories} kcal</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryView;
