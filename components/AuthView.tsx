
import * as React from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { User } from "../App";
import { Shield, Mail, Lock, User as UserIcon, Fingerprint, ChevronRight } from "lucide-react";

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [showBiometric, setShowBiometric] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const isTestAdmin = email.toLowerCase().includes('admin');
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: mode === 'register' ? name : (isTestAdmin ? "Master Admin" : "Premium Investor"),
        email: email,
        role: isTestAdmin ? 'admin' : 'user',
        kycStatus: 'none'
      };
      setLoading(false);
      onAuthSuccess(mockUser);
    }, 1200);
  };

  return (
    <div className="container mx-auto px-6 py-24 flex justify-center items-center min-h-[85vh] animate-fadeIn">
      <Card className="w-full max-w-xl border-0 bg-white dark:bg-[#080808] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-12 relative overflow-hidden transition-all duration-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00a2bd] via-[#e76408] to-[#00a2bd]" />
        
        <div className="flex flex-col items-center mb-12 relative z-10">
          <div className="relative mb-6 group cursor-pointer" onClick={() => setShowBiometric(!showBiometric)}>
             <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black transition-transform duration-500 group-hover:scale-110">
                {showBiometric ? <Fingerprint className="w-10 h-10 animate-pulse" /> : <Shield className="w-10 h-10" />}
             </div>
             <div className="absolute inset-0 rounded-full border border-[#00a2bd] animate-ping opacity-20" />
          </div>
          
          <h2 className="text-4xl font-condensed uppercase tracking-tighter text-black dark:text-white">
            {mode === 'login' ? 'Institutional Access' : 'Join the Desk'}
          </h2>
          <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mt-3">
            {mode === 'login' ? 'Secure Login Terminal' : 'Digital Onboarding'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-[0.2em]">Account Holder</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00a2bd] transition-colors" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Legal Name" 
                  className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 rounded-none py-4 pl-12 pr-4 focus:outline-none focus:border-[#00a2bd] focus:bg-white dark:focus:bg-white/[0.05] transition-all font-medium" 
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-[0.2em]">Verified Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00a2bd] transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@upbotrading.com" 
                className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 rounded-none py-4 pl-12 pr-4 focus:outline-none focus:border-[#00a2bd] focus:bg-white dark:focus:bg-white/[0.05] transition-all font-medium" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-[0.2em]">Secret Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00a2bd] transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 rounded-none py-4 pl-12 pr-4 focus:outline-none focus:border-[#00a2bd] focus:bg-white dark:focus:bg-white/[0.05] transition-all font-medium" 
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-5 text-[10px] font-black tracking-[0.4em] uppercase mt-4 shadow-xl" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {mode === 'login' ? 'Establish Session' : 'Create Credentials'}
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 text-center relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            {mode === 'login' ? "Need an institutional account?" : "Already have access?"}
            <button 
              type="button" 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="ml-3 text-[#00a2bd] hover:text-[#e76408] transition-colors underline-offset-4 underline"
            >
              {mode === 'login' ? 'Onboard Now' : 'Login'}
            </button>
          </p>
        </div>

        <div className="mt-8 bg-gray-50 dark:bg-white/[0.02] p-4 border border-black/5 dark:border-white/5 relative z-10 rounded-sm">
            <p className="text-[8px] text-gray-400 uppercase tracking-[0.2em] leading-relaxed flex items-center gap-2">
                <Shield className="w-3 h-3 text-[#e76408]" />
                <span><span className="text-[#e76408] font-black">PRO-TIP:</span> Use email with <code className="text-[#00a2bd] font-black bg-[#00a2bd]/10 px-1 px-1 rounded-sm">"admin"</code> for full governance access.</span>
            </p>
        </div>
      </Card>
    </div>
  );
};
