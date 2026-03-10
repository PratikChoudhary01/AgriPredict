import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, LogOut, User, BarChart3, Home } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    // Mocking user state for demonstration
    const user = { email: 'farmer@example.com' };

    const handleLogout = async () => {
        console.log("Mock Logout");
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-agri-green text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Sprout className="h-8 w-8 text-agri-gold" />
                            <span className="text-xl font-serif font-bold tracking-tight">AgriPredict</span>
                        </Link>

                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="hover:text-agri-gold transition-colors flex items-center space-x-1">
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                            <Link to="/predict" className="hover:text-agri-gold transition-colors flex items-center space-x-1">
                                <BarChart3 className="h-4 w-4" />
                                <span>Predict</span>
                            </Link>
                            <Link to="/history" className="hover:text-agri-gold transition-colors flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>History</span>
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm hidden sm:inline opacity-80">{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-stone-900 text-stone-400 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <Sprout className="h-6 w-6 text-agri-gold" />
                        <span className="text-lg font-serif font-bold text-white">AgriPredict</span>
                    </div>
                    <p className="text-sm">Empowering farmers with AI-driven insights for a sustainable future.</p>
                    <p className="text-xs mt-4">© {new Date().getFullYear()} AgriPredict. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
