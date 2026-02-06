import React, { useState } from "react";
import { ChefHat } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";
import { register } from "../app_services/auth.service";

const RegisterView: React.FC = () => {
    const { setView, setCurrentUser } = useNutrix();

    // Local form state
    const [authName, setAuthName] = useState("");
    const [authEmail, setAuthEmail] = useState("");

    // Handle registration
    const handleRegister = async () => { 
        const user = await register(authName, authEmail);
        setCurrentUser(user);  
        setView("profileView");     

};

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-600 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-emerald-100 rounded-full">
                        <ChefHat className="w-10 h-10 text-emerald-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center mb-2">Nutrix</h1>
                <p className="text-slate-500 text-center mb-8">AI-Powered Nutrition Assistant</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>
                    <button className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-lg">
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setView("loginView")}
                        className="text-emerald-600 font-medium hover:underline"
                    >
                        Already have an account? Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
