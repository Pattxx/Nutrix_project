import React, { useState, useEffect } from "react";

interface MacroData {
    name: string;
    value: number;
    color: string;
}

interface MacroBarsProps {
    macroData: MacroData[];
}

const MacroBars: React.FC<MacroBarsProps> = ({ macroData }) => {
    const [heights, setHeights] = useState<number[]>(
        macroData.map(() => 0) 
    );

    useEffect(() => {
        const maxValue = Math.max(...macroData.map((d) => d.value));
        const newHeights = macroData.map(
            (m) => Math.max((m.value / maxValue) * 100, 5) // min 5%
        );
        const timeout = setTimeout(() => setHeights(newHeights), 100);
        return () => clearTimeout(timeout);
    }, [macroData]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium mb-4">
                Macronutrients (g)
            </h3>

            <div className="flex justify-around items-end h-36 gap-6">
                {macroData.map((m, index) => (
                    <div key={m.name} className="flex flex-col items-center gap-2">
                        <div
                            className="w-10 rounded-t-xl transition-all duration-700"
                            style={{
                                height: `${heights[index]}%`,
                                backgroundColor: m.color,
                            }}
                        />
                        <span className="text-sm font-bold">{m.value.toFixed(1)}g</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">
                            {m.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MacroBars;
