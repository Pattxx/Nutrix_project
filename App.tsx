import React from "react";
import DashboardView from "./views/DashboardView";
import PantryView from "./views/PantryView";
import RecipeGenView from "./views/RecipeGenView";
import HistoryView from "./views/HistoryView";
import WeeklyView from "./views/WeeklyView";
import ProfileView from "./views/ProfileView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";

import { NutrixProvider, useNutrix } from "./context/NutrixContext";

import {
    LayoutDashboard, Utensils, ChefHat, History, TrendingUp, User, LogOut
} from "lucide-react";

const AppContent: React.FC = () => {
    const { view, setView, logout } = useNutrix();

    if (view === 'loginView') return <LoginView />;
    if (view === 'registerView') return <RegisterView />;


    return (
        <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64 flex flex-col bg-slate-50">

            <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50">
                <div className="p-6 flex items-center gap-3">
                    <span className="text-2xl font-bold tracking-tight text-emerald-600">Nutrix</span>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    <NavItem icon={<LayoutDashboard />} label="Dashboard" active={view === 'dashboardView'} onClick={() => setView('dashboardView')} />
                    <NavItem icon={<Utensils />} label="Log Food" active={view === 'pantryView'} onClick={() => setView('pantryView')} />
                    <NavItem icon={<ChefHat />} label="AI Recipes" active={view === 'recipeGenView'} onClick={() => setView('recipeGenView')} />
                    <NavItem icon={<History />} label="History" active={view === 'historyView'} onClick={() => setView('historyView')} />
                    <NavItem icon={<TrendingUp />} label="Weekly" active={view === 'weeklyView'} onClick={() => setView('weeklyView')} />
                    <NavItem icon={<User />} label="Profile" active={view === 'profileView'} onClick={() => setView('profileView')} />
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>


            <main className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full">
                {view === 'dashboardView' && <DashboardView />}
                {view === 'pantryView' && <PantryView />}
                {view === 'recipeGenView' && <RecipeGenView />}
                {view === 'historyView' && <HistoryView />}
                {view === 'weeklyView' && <WeeklyView />}
                {view === 'profileView' && <ProfileView />}
            </main>


            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-between items-center z-50 overflow-x-auto">
                <MobileNavItem icon={<LayoutDashboard />} active={view === 'dashboardView'} onClick={() => setView('dashboardView')} />
                <MobileNavItem icon={<Utensils />} active={view === 'pantryView'} onClick={() => setView('pantryView')} />
                <MobileNavItem icon={<ChefHat />} active={view === 'recipeGenView'} onClick={() => setView('recipeGenView')} />
                <MobileNavItem icon={<History />} active={view === 'historyView'} onClick={() => setView('historyView')} />
                <MobileNavItem icon={<TrendingUp />} active={view === 'weeklyView'} onClick={() => setView('weeklyView')} />
                <MobileNavItem icon={<User />} active={view === 'profileView'} onClick={() => setView('profileView')} />
            </nav>
        </div>
    );
};


const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-3 transition font-medium ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'}`}
    >
        {React.isValidElement(icon) && 
  React.cloneElement(icon as React.ReactElement<{ size?: number }>, { 
    size: 20 
  })
}
        <span>{label}</span>
    </button>
);

const MobileNavItem: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void }> = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-3 transition-all ${active ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
    >
        {React.isValidElement(icon) && 
  React.cloneElement(icon as React.ReactElement<{ size?: number }>, { 
    size: 20 
  })
}
    </button>
);


const App: React.FC = () => (
    <NutrixProvider>
        <AppContent />
    </NutrixProvider>
);

export default App;
