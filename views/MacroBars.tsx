import React from "react";
import { Dna, Wheat, Droplet } from "lucide-react"; 
import { JSX } from "react/jsx-runtime";

export interface MacroData {
    name: string;
    value: number; 
    target: number; 
    color: string;
    icon: JSX.Element;
}

interface MacroBarsProps {
    macroData: MacroData[];
}

const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
};

const MacroBars: React.FC<MacroBarsProps> = ({ macroData }) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full max-w-sm">
            <h4 className="text-lg font-bold mb-6">Nutritional Breakdown</h4>
            <div className="space-y-4">
                {macroData.map((m) => {
                    // Scale relative to target saved in profile
                    const widthPercent = Math.min((m.value / m.target) * 100, 100);

                    return (
                        <div key={m.name} className="flex items-center gap-4">
                           
                            <div className="p-2 bg-slate-100 rounded-lg w-10 h-10 flex items-center justify-center">
                                {m.icon}
                            </div>

                            {/* Bar */}
                            <div className="flex-1">
                                <div className="bg-slate-100 rounded-full h-4 w-full overflow-hidden">
                                    <div
                                        className={`${colorMap[m.color]} h-4 rounded-full transition-all duration-700`}
                                        style={{ width: `${widthPercent}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-slate-500 font-medium">
                                    <span>{m.name}</span>
                                    <span>
                                        {m.value.toFixed(1)} / {m.target} g
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MacroBars;
