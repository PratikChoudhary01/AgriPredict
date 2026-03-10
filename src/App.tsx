import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Predictor } from './components/Predictor';
import { Sprout, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'motion';

const Home = () => {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
                        alt="Farm"
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-5xl sm:text-7xl font-serif font-bold leading-tight mb-6">
                            Predicting the <span className="text-agri-gold italic">Future</span> of Your Harvest
                        </h1>
                        <p className="text-xl text-stone-200 mb-8 leading-relaxed">
                            AgriPredict uses advanced AI to analyze soil, weather, and crop data, providing you with precision yield estimates and actionable farming advice.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <NavigateButton to="/predict" primary>
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </NavigateButton>
                            <NavigateButton to="#features">
                                Learn More
                            </NavigateButton>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Why AgriPredict?</h2>
                    <div className="w-24 h-1 bg-agri-gold mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard
                        icon={<Zap className="h-8 w-8 text-agri-gold" />}
                        title="Real-time Analysis"
                        description="Get instant yield predictions based on current environmental factors and historical data."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-8 w-8 text-agri-gold" />}
                        title="Data-Driven Decisions"
                        description="Reduce risks by making informed choices about planting, irrigation, and fertilization."
                    />
                    <FeatureCard
                        icon={<Globe className="h-8 w-8 text-agri-gold" />}
                        title="Global Insights"
                        description="Our models are trained on diverse agricultural datasets from across the globe."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="bg-agri-green py-20">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <Sprout className="h-16 w-16 text-agri-gold mx-auto mb-6" />
                    <h2 className="text-4xl font-serif font-bold mb-6">Ready to optimize your farm?</h2>
                    <p className="text-xl text-agri-cream/80 mb-10">Join thousands of farmers using AgriPredict to increase their productivity and sustainability.</p>
                    <NavigateButton to="/predict" primary className="bg-agri-gold hover:bg-agri-gold/90">
                        Start Your First Prediction
                    </NavigateButton>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow text-center">
        <div className="bg-agri-cream w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">{title}</h3>
        <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
);

const NavigateButton = ({ to, children, primary, className }: any) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => to.startsWith('#') ? document.querySelector(to)?.scrollIntoView({ behavior: 'smooth' }) : navigate(to)}
            className={`px-8 py-3 rounded-full font-bold transition-all flex items-center ${primary
                ? 'bg-agri-green text-white hover:bg-agri-green/90 shadow-lg hover:shadow-agri-green/20'
                : 'bg-white text-agri-green hover:bg-stone-50 border border-stone-200'
                } ${className}`}
        >
            {children}
        </button>
    );
};

export default function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/predict" element={<Predictor />} />
                    <Route path="/history" element={
                        <div className="max-w-4xl mx-auto p-8 text-center">
                            <h2 className="text-3xl font-serif font-bold mb-4">Prediction History</h2>
                            <p className="text-stone-500 italic">History feature coming soon...</p>
                        </div>
                    } />
                </Routes>
            </Layout>
        </Router>
    );
}
