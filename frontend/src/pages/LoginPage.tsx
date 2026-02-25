import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginWithEmailPassword, signUpCustomer } from '../lib/authStore';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = loginWithEmailPassword(email, password);
    setLoading(false);
    if (!user) {
      toast.error('Invalid email or password');
      return;
    }
    toast.success(`Welcome back, ${user.name}!`);
    if (user.role === 'owner') {
      navigate({ to: '/owner-dashboard' });
    } else {
      navigate({ to: '/customer-dashboard' });
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = signUpCustomer(email, password, name);
    setLoading(false);
    if (!user) {
      toast.error('Email already registered or invalid');
      return;
    }
    toast.success(`Account created! Welcome, ${user.name}!`);
    navigate({ to: '/customer-dashboard' });
  };

  const handleGoogleLogin = () => {
    toast.info('Google Sign-In: Please use email/password login for this platform.');
  };

  const handleMicrosoftLogin = () => {
    toast.info('Microsoft Sign-In: Please use email/password login for this platform.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 shadow-2xl">
            <img
              src="/assets/generated/salon-logo.dim_512x512.png"
              alt="Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-white font-playfair">Enrich Beauty Parlour</h1>
          <p className="text-purple-300 text-sm mt-1 font-cormorant tracking-widest uppercase">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Mode Toggle */}
          <div className="flex rounded-2xl bg-white/10 p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white text-purple-900 shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-white text-purple-900 shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-4">
            {/* Name field (signup only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                  <Input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-purple-300 focus:ring-purple-300/30"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">Email (Gmail ID)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                <Input
                  type="email"
                  placeholder="your@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-purple-300 focus:ring-purple-300/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleSignIn() : handleSignUp())}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-purple-300 focus:ring-purple-300/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In / Sign Up Button */}
            <Button
              onClick={mode === 'login' ? handleSignIn : handleSignUp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-xl py-3 font-semibold shadow-lg shadow-purple-900/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-transparent px-3 text-white/50">or continue with</span>
              </div>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 font-medium text-sm"
            >
              <SiGoogle className="w-4 h-4 text-red-400" />
              Continue with Google
            </button>

            {/* Microsoft */}
            <button
              onClick={handleMicrosoftLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 font-medium text-sm"
            >
              {/* Windows/Microsoft logo using colored squares */}
              <span className="grid grid-cols-2 gap-0.5 w-4 h-4 flex-shrink-0">
                <span className="bg-red-500 rounded-sm" />
                <span className="bg-green-500 rounded-sm" />
                <span className="bg-blue-500 rounded-sm" />
                <span className="bg-yellow-400 rounded-sm" />
              </span>
              Continue with Microsoft
            </button>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          By signing in, you agree to our Privacy Policy &amp; Terms of Service
        </p>
      </div>
    </div>
  );
}
