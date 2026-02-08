import React, { useState } from "react";
import { ChefHat } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";
import { register } from "../app_services/auth.service";

const RegisterView: React.FC = () => {
    const { setView, setCurrentUser } = useNutrix();

    // Local form state
    const [authName, setAuthName] = useState("");
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authPasswordConfirm, setAuthPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle registration
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!authName || !authEmail || !authPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (authPassword !== authPasswordConfirm) {
            setError("Passwords do not match");
            return;
        }

        if (authPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const user = await register(authName, authEmail, authPassword);
            setCurrentUser(user);
            setView("profileView");
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
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
                            required
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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="At least 6 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={authPasswordConfirm}
                            onChange={(e) => setAuthPasswordConfirm(e.target.value)}
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white font-semibold rounded-lg transition shadow-lg ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

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
