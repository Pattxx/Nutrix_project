import React, { useState } from "react";
import { ChefHat } from "lucide-react";
import { useNutrix } from "../context/NutrixContext";
import { login } from "../app_services/auth.service";

const LoginView: React.FC = () => {
    const { setView, setCurrentUser, logout } = useNutrix();
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const user = await login(authEmail, authPassword);
            if (user) {
                setCurrentUser(user);
                setView("dashboardView");
            } else {
                try { logout(); } catch {}
                setError("Invalid email or password. Please try again.");
                setAuthPassword("");
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError("Login failed. Please try again later.");
            setAuthPassword("");
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

                <form onSubmit={handleLogin} className="space-y-4">
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
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 text-white font-semibold rounded-lg transition shadow-lg ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-center text-red-600 font-medium">{error}</div>
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setView("registerView")}
                        className="text-emerald-600 font-medium hover:underline"
                    >
                        Don't have an account? Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
