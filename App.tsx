
import * as React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { SpotlightShell } from "./components/vaneck/SpotlightShell";
import Navbar from "./components/Navbar";
import { VaneckFooter } from "./components/vaneck/VaneckFooter";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";
import { MarketingView } from "./components/MarketingView";
import { AuthView } from "./components/AuthView";
import { DashboardView } from "./components/DashboardView";
import { KYCView } from "./components/KYCView";
import { AdminView } from "./components/AdminView";
import { ProtectedRoute } from "./ProtectedRoute";
import { Chatbot } from "./components/Chatbot";

export type ViewState = 'marketing' | 'auth' | 'dashboard' | 'kyc' | 'admin';
export type KYCStatus = 'none' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  kycStatus: KYCStatus;
}

export interface Position {
  id: string;
  symbol: string;
  entry: number;
  qty: number;
  side: 'Buy' | 'Sell';
}

export interface Transaction {
  id: string;
  date: string;
  symbol: string;
  type: 'MUA' | 'BÁN';
  value: number;
  status: 'Khớp' | 'Hoàn tất' | 'Đang xử lý';
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

const MainContent = () => {
  const [hasKey, setHasKey] = React.useState(false);
  
  React.useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true);
      }
    };
    checkKey();

    const handleInvalidKey = () => {
      console.warn("Invalid API Key detected. Resetting session.");
      setHasKey(false);
    };
    window.addEventListener('upbot-invalid-api-key', handleInvalidKey);

    return () => window.removeEventListener('upbot-invalid-api-key', handleInvalidKey);
  }, []);

  const [currentView, setCurrentView] = React.useState<ViewState>(() => {
    const hash = window.location.hash.replace('#', '') as ViewState;
    const validViews: ViewState[] = ['marketing', 'auth', 'dashboard', 'kyc', 'admin'];
    return validViews.includes(hash) ? hash : 'marketing';
  });
  
  const [user, setUser] = React.useState<User | null>(() => {
    const saved = localStorage.getItem('upbot_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Portfolio State
  const [cashBalance, setCashBalance] = React.useState<number>(() => {
    const saved = localStorage.getItem('upbot_cash_balance');
    return saved ? parseFloat(saved) : 100000000.00; // Khởi tạo 100 triệu VND cho Paper Trading
  });

  const [positions, setPositions] = React.useState<Position[]>(() => {
    const saved = localStorage.getItem('upbot_positions');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem('upbot_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Global Market Data for Portfolio Valuation
  const [globalMarketPrices, setGlobalMarketPrices] = React.useState<Record<string, number>>({});

  // Persist Portfolio
  React.useEffect(() => {
    localStorage.setItem('upbot_cash_balance', cashBalance.toString());
    localStorage.setItem('upbot_positions', JSON.stringify(positions));
    localStorage.setItem('upbot_transactions', JSON.stringify(transactions));
  }, [cashBalance, positions, transactions]);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem('upbot_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('upbot_user_session');
    }
  }, [user]);

  React.useEffect(() => {
    window.location.hash = currentView;
  }, [currentView]);

  const handlePlaceOrder = (order: { symbol: string, qty: number, price: number, side: 'Buy' | 'Sell' }) => {
    const totalValue = order.qty * order.price;
    
    if (order.side === 'Buy') {
      if (totalValue > cashBalance) {
        throw new Error("Số dư không đủ để thực hiện lệnh mua!");
      }
      setCashBalance(prev => prev - totalValue);
      
      setPositions(prev => {
        const existing = prev.find(p => p.symbol === order.symbol);
        if (existing) {
          const totalQty = existing.qty + order.qty;
          const avgEntry = ((existing.entry * existing.qty) + (order.price * order.qty)) / totalQty;
          return prev.map(p => p.symbol === order.symbol ? { ...p, qty: totalQty, entry: avgEntry } : p);
        }
        return [...prev, { id: Math.random().toString(36).substr(2, 9), symbol: order.symbol, entry: order.price, qty: order.qty, side: 'Buy' }];
      });
    } else {
      const existing = positions.find(p => p.symbol === order.symbol);
      if (!existing || existing.qty < order.qty) {
        throw new Error("Không đủ số lượng cổ phiếu để bán!");
      }
      setCashBalance(prev => prev + totalValue);
      setPositions(prev => {
        if (existing.qty === order.qty) return prev.filter(p => p.symbol !== order.symbol);
        return prev.map(p => p.symbol === order.symbol ? { ...p, qty: p.qty - order.qty } : p);
      });
    }

    const newTx: Transaction = {
      id: `TR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString('vi-VN'),
      symbol: order.symbol,
      type: order.side === 'Buy' ? 'MUA' : 'BÁN',
      value: totalValue,
      status: 'Khớp'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const updateGlobalPrices = (prices: Record<string, number>) => {
    setGlobalMarketPrices(prev => ({ ...prev, ...prices }));
  };

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = () => {
    setUser(null);
    setCurrentView('marketing');
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateKYCStatus = (status: KYCStatus) => {
    if (user) {
      setUser({ ...user, kycStatus: status });
    }
  };

  if (!hasKey && window.aistudio) {
    return (
      <SpotlightShell className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white dark:bg-[#101010] p-8 rounded-xl shadow-2xl border border-black/5 dark:border-white/10">
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">API Key Required</h1>
          <p className="mb-8 text-gray-500 text-sm">Access to UPBOTRADING's live market intelligence requires a valid Google Cloud API Key.</p>
          <button 
            onClick={async () => {
              await window.aistudio?.openSelectKey();
              setHasKey(true);
            }}
            className="w-full bg-[#00a2bd] text-white px-6 py-4 rounded font-bold hover:bg-[#008fa7] transition-colors uppercase tracking-widest text-xs"
          >
            Select API Key
          </button>
          <div className="mt-6">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-[#00a2bd] underline">
              View Billing Information
            </a>
          </div>
        </div>
      </SpotlightShell>
    );
  }

  return (
    <SpotlightShell className="min-h-screen">
      <Navbar 
        currentView={currentView} 
        onNavigate={navigateTo} 
        user={user} 
        onLogout={logout} 
      />

      <main className="pt-0">
        {currentView === 'marketing' && (
          <MarketingView 
            onStart={() => navigateTo('auth')} 
            onPlaceOrder={handlePlaceOrder}
            positions={positions}
            onUpdatePrices={updateGlobalPrices}
          />
        )}
        
        {currentView === 'auth' && (
          <div className="pt-20">
            <AuthView onAuthSuccess={handleAuthSuccess} />
          </div>
        )}

        {currentView === 'dashboard' && (
          <ProtectedRoute user={user} fallbackView="marketing" onNavigate={navigateTo}>
            <div className="pt-20">
              {user && (
                <DashboardView 
                  user={user} 
                  cashBalance={cashBalance}
                  positions={positions}
                  transactions={transactions}
                  marketPrices={globalMarketPrices}
                  onStartKYC={() => navigateTo('kyc')} 
                  onGoAdmin={() => navigateTo('admin')} 
                />
              )}
            </div>
          </ProtectedRoute>
        )}

        {currentView === 'kyc' && (
          <ProtectedRoute user={user} fallbackView="dashboard" onNavigate={navigateTo}>
            <div className="pt-20">
              {user && (
                <KYCView 
                  user={user} 
                  onComplete={() => {
                    updateKYCStatus('pending');
                    navigateTo('dashboard');
                  }} 
                  onCancel={() => navigateTo('dashboard')}
                />
              )}
            </div>
          </ProtectedRoute>
        )}

        {currentView === 'admin' && (
          <ProtectedRoute user={user} requiredRole="admin" fallbackView="dashboard" onNavigate={navigateTo}>
            <div className="pt-20">
              {user && user.role === 'admin' && (
                <AdminView 
                  onBack={() => navigateTo('dashboard')} 
                  onVerifyUser={(uid) => {
                      if (user && user.id === uid) {
                        updateKYCStatus('verified');
                      }
                  }}
                />
              )}
            </div>
          </ProtectedRoute>
        )}
      </main>

      <VaneckFooter />
      <Chatbot />
      <SpeedInsights />
    </SpotlightShell>
  );
};

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
