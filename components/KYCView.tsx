
import * as React from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
// Import Badge component from ui folder
import { Badge } from "./ui/Badge";
import { User } from "../App";
// Import icons from lucide-react, aliasing User to UserIcon to prevent naming collision with the User interface
import { Shield, FileText, Camera, Check, RefreshCw, X, Maximize, User as UserIcon } from "lucide-react";

interface KYCViewProps {
  user: User;
  onComplete: () => void;
  onCancel: () => void;
}

export const KYCView: React.FC<KYCViewProps> = ({ user, onComplete, onCancel }) => {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [cameraActive, setCameraActive] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Please allow camera access to complete verification.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const nextStep = () => {
    if (cameraActive) stopCamera();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(onComplete, 2000);
    }
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12 animate-fadeIn max-w-3xl">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#00a2bd]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Verified Onboarding</span>
        </div>
        <h1 className="text-5xl font-condensed uppercase tracking-tighter">Identity Governance</h1>
        <p className="text-gray-500 mt-2">Secure biometric and document verification for institutional trading.</p>
      </div>

      <div className="flex justify-between items-center mb-12 relative px-10">
        <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[1px] bg-gray-100 dark:bg-white/5 -z-10" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center gap-3">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all duration-500 border-2 ${
                  step >= s 
                    ? 'bg-[#00a2bd] border-[#00a2bd] text-white shadow-lg' 
                    : 'bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 text-gray-300'
                }`}
              >
                {step > s ? <Check className="w-6 h-6" /> : s}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${step >= s ? 'text-[#00a2bd]' : 'text-gray-400'}`}>
                {s === 1 ? 'Attributes' : s === 2 ? 'Verification' : 'Confirm'}
              </span>
          </div>
        ))}
      </div>

      <Card className="border-0 bg-white dark:bg-[#080808] p-10 shadow-2xl relative overflow-hidden">
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[#00a2bd]/10 rounded-full flex items-center justify-center text-[#00a2bd]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold uppercase font-condensed tracking-tight">Personal Profile</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Legal Information Registry</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 p-4 focus:outline-none focus:border-[#00a2bd] font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Identification ID</label>
                <input type="text" placeholder="Passport / ID Number" className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 p-4 focus:outline-none focus:border-[#00a2bd] font-medium" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Permanent Residence</label>
                <input type="text" placeholder="Global Address" className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 p-4 focus:outline-none focus:border-[#00a2bd] font-medium" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e76408]/10 rounded-full flex items-center justify-center text-[#e76408]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold uppercase font-condensed tracking-tight">Biometric Scan</h2>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Document & Face Authentication</p>
                  </div>
                </div>
                {cameraActive && (
                  <button onClick={stopCamera} className="text-red-500 p-2 hover:bg-red-500/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
            </div>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl">
              {!cameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={startCamera}>
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Maximize className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Activate Secure Feed</h3>
                  <p className="text-gray-500 text-xs max-w-xs uppercase tracking-widest">Ensure you are in a well-lit environment for optimal verification.</p>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {/* Scanner Overlay UI */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[80%] h-[70%] border-2 border-white/50 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00a2bd] shadow-[0_0_15px_#00a2bd] animate-kyc-scan" />
                      <div className="absolute top-0 left-0 w-full h-full border-[60px] border-black/60" />
                      <div className="absolute inset-0 border-2 border-[#00a2bd] opacity-40 animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                    <Badge className="bg-green-500 text-white border-0 animate-pulse">Target Locked</Badge>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: 'Front ID', icon: FileText, done: false },
                 { label: 'Back ID', icon: FileText, done: false },
                 { label: 'Liveness', icon: UserIcon, done: false }
               ].map((item, i) => (
                 <div key={i} className="bg-black/5 dark:bg-white/[0.03] p-4 rounded-sm flex flex-col items-center gap-2 border border-black/5 dark:border-white/5 opacity-50">
                   <item.icon className="w-4 h-4" />
                   <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fadeIn text-center">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20">
                <Shield className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold uppercase font-condensed tracking-tight">Attestation Required</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Compliance & Privacy Agreement</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-white/[0.02] p-8 rounded-lg text-left border border-black/5 dark:border-white/5">
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
                        <span className="text-[10px] text-gray-400 font-black uppercase">Verified Entity:</span>
                        <span className="text-xs font-bold">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
                        <span className="text-[10px] text-gray-400 font-black uppercase">Document ID:</span>
                        <span className="text-xs font-mono font-bold">UPB-8829-4402</span>
                    </div>
                </div>
                <p className="text-[9px] text-gray-400 mt-8 italic leading-relaxed">
                    By confirming, you authorize UPBOTRADING to process your biometric data solely for the purpose of identity verification in compliance with AML/KYC regulations for institutional investment.
                </p>
            </div>
          </div>
        )}

        <div className="mt-12 flex gap-6">
          <Button variant="outline" className="flex-1 py-5" onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
            {step === 1 ? 'Discard' : 'Back'}
          </Button>
          <Button variant="primary" className="flex-1 py-5 shadow-xl" onClick={nextStep} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Encrypting Profile...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {step === 3 ? 'Finalize Attestation' : 'Execute Step'}
                <Check className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </Card>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kyc-scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-kyc-scan {
          animation: kyc-scan 3s infinite linear;
        }
      `}} />
    </div>
  );
};
