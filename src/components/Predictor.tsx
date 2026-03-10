import React, { useState } from 'react';
import { CROP_TYPES, SOIL_TYPES, REGIONS } from '../constants';
import { predictCropYield } from '../services/apiService';
import { Wheat, Droplets, Thermometer, MapPin, Layers, CheckCircle2, AlertCircle, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion';

// Mocking some components to avoid errors if they are not yet created
const Button = ({ children, onClick, isLoading, type, className, variant }: any) => (
    <button
        type={type}
        onClick={onClick}
        disabled={isLoading}
        className={`px-6 py-3 rounded-xl font-bold transition-all ${variant === 'outline'
            ? 'border-2 border-agri-green text-agri-green hover:bg-agri-green/10'
            : 'bg-agri-green text-white hover:bg-agri-green/90'
            } ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {isLoading ? 'Processing...' : children}
    </button>
);

export const Predictor: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        cropType: CROP_TYPES[0],
        soilType: SOIL_TYPES[0],
        region: REGIONS[0],
        rainfall: 500,
        temperature: 25,
        fertilizerUsed: 'NPK 10-26-26'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            const prediction = await predictCropYield(formData);
            setResult(prediction);
        } catch (err) {
            console.error(err);
            alert("Error generating prediction. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Yield Predictor</h2>
                        <p className="text-stone-600">Enter your farm details to get AI-powered yield estimates and recommendations.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                    <Wheat className="h-4 w-4 text-agri-green" /> Crop Type
                                </label>
                                <select
                                    value={formData.cropType}
                                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                                    className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-agri-green/50 outline-none"
                                >
                                    {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-agri-green" /> Soil Type
                                </label>
                                <select
                                    value={formData.soilType}
                                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                                    className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-agri-green/50 outline-none"
                                >
                                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-agri-green" /> Region
                                </label>
                                <select
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-agri-green/50 outline-none"
                                >
                                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                    <Droplets className="h-4 w-4 text-agri-green" /> Rainfall (mm)
                                </label>
                                <input
                                    type="number"
                                    value={formData.rainfall}
                                    onChange={(e) => setFormData({ ...formData, rainfall: Number(e.target.value) })}
                                    className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-agri-green/50 outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-agri-green" /> Temp (°C)
                                </label>
                                <input
                                    type="number"
                                    value={formData.temperature}
                                    onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                                    className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-agri-green/50 outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-stone-700">Fertilizer Used</label>
                                <input
                                    type="text"
                                    value={formData.fertilizerUsed}
                                    onChange={(e) => setFormData({ ...formData, fertilizerUsed: e.target.value })}
                                    className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-agri-green/50 outline-none"
                                    placeholder="e.g. NPK 10-26-26"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" isLoading={loading}>
                            Run Prediction
                        </Button>
                    </form>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-8 rounded-3xl shadow-xl border-2 border-agri-green/20 h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-serif font-bold text-stone-900">Prediction Result</h3>
                                    <div className="bg-agri-green/10 text-agri-green px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4" /> AI Verified
                                    </div>
                                </div>

                                <div className="text-center mb-10">
                                    <div className="text-6xl font-serif font-bold text-agri-green mb-2">
                                        {result.predictedYield}
                                        <span className="text-2xl text-stone-400 font-sans ml-2">t/ha</span>
                                    </div>
                                    <p className="text-stone-500 uppercase tracking-widest text-sm font-bold">Estimated Yield</p>
                                </div>

                                <div className="bg-agri-cream p-4 rounded-xl mb-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-stone-600">Confidence Score</span>
                                        <span className="text-sm font-bold text-agri-green">{Math.round(result.confidence * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-stone-200 rounded-full h-2">
                                        <div
                                            className="bg-agri-green h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${result.confidence * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 flex-grow">
                                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-agri-gold" /> Expert Recommendations
                                    </h4>
                                    <ul className="space-y-3">
                                        {result.recommendations.map((rec: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-stone-600 text-sm leading-relaxed">
                                                <span className="bg-agri-gold/20 text-agri-gold h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                                    {i + 1}
                                                </span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button
                                    variant="outline"
                                    className="mt-8 w-full"
                                    onClick={() => setResult(null)}
                                >
                                    New Prediction
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-agri-earth/5 border-2 border-dashed border-agri-earth/20 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center"
                            >
                                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                                    <Sprout className="h-16 w-16 text-agri-green opacity-20" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Ready to Predict</h3>
                                <p className="text-stone-500 max-w-xs">Fill out the form to see your predicted crop yield and expert advice.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
