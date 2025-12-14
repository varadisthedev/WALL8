import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { AreaChart, BarChart, TrendingUp, PieChart, Shield, Zap, X, ArrowRight, Wallet, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

// Color Palette
const colors = {
    bg: '#001D39',
    darkBlue: '#0A4174',
    primary: '#49769F',
    teal: '#4E8EA2',
    lightTeal: '#6EA2B3',
    sky: '#7BBDE8',
    lightest: '#BDD8E9',
};

const LandingPage = ({ autoOpenLogin = false }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(autoOpenLogin);
    const navigate = useNavigate();
    const { signIn, isLoaded } = useSignIn();

    // Update state if prop changes
    useEffect(() => {
        if (autoOpenLogin) setIsLoginOpen(true);
    }, [autoOpenLogin]);

    const handleGoogleLogin = () => {
        if (!isLoaded) return;
        signIn.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: '/sso-callback'
        });
    };

    return (
        <div className="min-h-screen text-[#BDD8E9] relative overflow-hidden font-sans selection:bg-[#4E8EA2] selection:text-white"
            style={{ 
                background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.darkBlue} 100%)` 
            }}
        >
            {/* Background Gradients/Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#49769F] blur-[120px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4E8EA2] blur-[100px] opacity-20"></div>

            {/* Navbar / Header */}
            <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white">
                    <div className="p-2 bg-gradient-to-br from-[#4E8EA2] to-[#49769F] rounded-lg shadow-lg">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    Wall8
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsLoginOpen(true)}
                        className="hidden md:block px-6 py-2 text-sm font-semibold text-[#BDD8E9] hover:text-white transition-colors"
                    >
                        Log In
                    </button>
                    <button 
                        onClick={handleGoogleLogin}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#4E8EA2] to-[#49769F] hover:from-[#6EA2B3] hover:to-[#4E8EA2] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-[#49769F]/50 transition-all transform hover:-translate-y-0.5"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 container mx-auto px-6 pt-16 pb-32 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-[#7BBDE8] mb-8 backdrop-blur-md animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-[#4E8EA2] animate-ping"></span>
                    Smart Expense Tracking for Everyone
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight max-w-4xl mx-auto drop-shadow-xl">
                    Master Your Money with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7BBDE8] to-[#4E8EA2]">Wall8</span>
                </h1>
                
                <p className="text-lg md:text-xl text-[#BDD8E9]/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Track daily expenses, visualize spending habits, and gain AI-powered insights. 
                    The modern way to manage your finances.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                        onClick={handleGoogleLogin}
                        className="px-8 py-4 bg-white text-[#0A4174] font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:bg-[#BDD8E9] transition-all transform hover:-translate-y-1 flex items-center gap-2 group"
                    >
                        Get Started Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                         onClick={() => setIsLoginOpen(true)}
                        className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-full backdrop-blur-md hover:bg-white/20 transition-all"
                    >
                        View Demo
                    </button>
                </div>

                {/* Glass Benefit Card Floating */}
                <div className="mt-16 relative w-full max-w-5xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#001D39] via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                   
                   <GlassCard className="relative z-10 border-white/10 bg-gradient-to-b from-white/10 to-white/5 !p-2 rounded-3xl">
                        <div className="bg-[#001D39]/80 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                             {/* APP PREVIEW MOCKUP */}
                             <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0A4174]/50">
                                 <div className="flex gap-2">
                                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                 </div>
                                 <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 min-h-[400px]">
                                 <div className="md:col-span-2 space-y-6">
                                     <div className="h-64 bg-gradient-to-b from-[#0A4174]/50 to-transparent rounded-xl border border-white/5 relative overflow-hidden flex items-end justify-center gap-4 p-6 group">
                                         {/* Abstract Chart Bars */}
                                         {[40, 70, 50, 90, 60, 80, 55].map((h, i) => (
                                             <div key={i} className="w-8 bg-[#4E8EA2] rounded-t-sm opacity-60 group-hover:opacity-100 transition-all duration-500 hover:bg-[#7BBDE8]" style={{ height: `${h}%` }}></div>
                                         ))}
                                     </div>
                                     <div className="grid grid-cols-3 gap-4">
                                         {[1,2,3].map(i => (
                                             <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5 animate-pulse"></div>
                                         ))}
                                     </div>
                                 </div>
                                 <div className="bg-white/5 rounded-xl border border-white/5 p-6 space-y-4">
                                      <div className="flex items-center gap-3 mb-6">
                                          <div className="p-2 bg-[#49769F] rounded-lg"><PieChart className="w-5 h-5 text-white" /></div>
                                          <div className="text-sm font-semibold">Spending Guide</div>
                                      </div>
                                      {[1,2,3,4].map(i => (
                                          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4E8EA2] to-[#0A4174]"></div>
                                                  <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                                              </div>
                                              <div className="h-2 w-8 bg-white/10 rounded-full"></div>
                                          </div>
                                      ))}
                                 </div>
                             </div>
                        </div>
                   </GlassCard>
                </div>
            </header>

            {/* Features Section */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
                    Everything you need to <br/>
                    <span className="text-[#7BBDE8]">take control</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={Zap}
                        title="Add Expenses Easily"
                        description="Log daily expenses in seconds. Categorize with a tap and keep your records organized effortlessly."
                        color="text-yellow-400"
                    />
                    <FeatureCard 
                        icon={TrendingUp}
                        title="Visual Insights"
                        description="Understand your money with beautiful, interactive charts. Spot trends and cut unnecessary costs."
                        color="text-[#4E8EA2]"
                    />
                    <FeatureCard 
                        icon={Shield}
                        title="Smart Analytics"
                        description="AI-powered analysis helps you stay within budget and achieve your savings goals faster."
                        color="text-[#7BBDE8]"
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-[#001D39]/50 backdrop-blur-lg">
                <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-xl text-white">
                        <Wallet className="w-5 h-5 text-[#4E8EA2]" />
                        Wall8
                    </div>
                    <div className="text-[#BDD8E9]/60 text-sm">
                        © 2025 Wall8 Inc. Built for the future of finance.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-[#BDD8E9]/60 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-[#BDD8E9]/60 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-[#BDD8E9]/60 hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <GlassCard className="hover:bg-white/10 group">
        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-[#BDD8E9]/70 leading-relaxed">
            {description}
        </p>
    </GlassCard>
);

const LoginModal = ({ isOpen, onClose }) => {
    const { signIn, isLoaded, setActive } = useSignIn();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        if (!isLoaded) return;
        signIn.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: '/sso-callback'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsSubmitting(true);
        setError("");

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                navigate('/dashboard');
            } else {
                console.log("Login incomplete", result);
                setError("Login incomplete. Please check your email for further steps.");
            }
        } catch (err) {
            console.error("Login error", err);
            setError(err.errors?.[0]?.message || "Invalid email or password");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <GlassCard className="w-full max-w-md relative z-10 !bg-[#001D39]/80 !border-white/20 animate-fade-in-up">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-gradient-to-br from-[#4E8EA2] to-[#0A4174] rounded-xl shadow-lg mb-4">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-[#BDD8E9]/70 mt-2">Enter your credentials to access your wallet</p>
                </div>

                <div className="space-y-4">
                     {/* Google Login Button */}
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full py-3 bg-white text-[#0A4174] hover:bg-[#BDD8E9] font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 relative group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase font-medium">Or continue with email</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[#BDD8E9] ml-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4E8EA2] focus:ring-1 focus:ring-[#4E8EA2] transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[#BDD8E9] ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4E8EA2] focus:ring-1 focus:ring-[#4E8EA2] transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-gradient-to-r from-[#4E8EA2] to-[#49769F] hover:from-[#6EA2B3] hover:to-[#4E8EA2] text-white font-bold rounded-xl shadow-lg shadow-[#49769F]/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                    
                    <div className="text-center mt-6">
                        <p className="text-[#BDD8E9]/60 text-sm">
                            Don't have an account?{' '}
                            <button type="button" onClick={() => navigate('/sign-up')} className="text-[#7BBDE8] hover:text-white font-semibold transition-colors">
                                Sign Up
                            </button>
                        </p>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default LandingPage;
