
import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { useLanguage } from '../LanguageContext';
import { getLiveMarketPrices, getSymbolAnalysis } from '../services/geminiService';
import { Badge } from './ui/Badge';
import { 
  Search as SearchIcon, 
  TrendingUp, 
  TrendingDown,
  RefreshCcw,
  Globe,
  AlertCircle,
  X,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  ShieldAlert,
  Zap,
  ListTodo,
  Sparkles,
  BrainCircuit,
  FileText,
  Eye,
  EyeOff,
  ChevronDown,
  HelpCircle,
  ChevronRight,
  Loader2,
  Activity,
  Info
} from "lucide-react";
import { Skeleton } from './ui/Skeleton';

// --- Types ---
interface StockData {
  symbol: string;
  name: string;
  ref: number;
  ceil: number;
  floor: number;
  price: number;
  vol: number;
  change: number;
  absChange: number;
  open: number;
  high: number;
  low: number;
  board: 'HOSE' | 'HNX' | 'UPCOM';
  marketCap?: string;
}

// --- Constants & Config ---

const ORDER_TYPES = [
  { value: "LO", label: "Limit (LO)", desc: "Limit Order: Buy or sell at a specific price or better. Valid throughout the continuous matching session." },
  { value: "MP", label: "Market (MP)", desc: "Market Price: Execute immediately at the best available price. Used on HOSE during continuous matching." },
  { value: "ATO", label: "ATO", desc: "At The Opening: Priority order for the Opening session (09:00-09:15). Matches at the Opening Price. Unmatched volume is cancelled." },
  { value: "ATC", label: "ATC", desc: "At The Closing: Priority order for the Closing session (14:30-14:45). Matches at the Closing Price. Determines the daily close." },
  { value: "MTL", label: "MTL", desc: "Market-to-Limit: Execute at Market Price. Any remaining volume is instantly converted to a Limit order at the last matched price." },
  { value: "MAK", label: "MAK", desc: "Match and Kill: Execute immediately at Market Price. Any unfilled volume is cancelled instantly. Partial fills allowed." },
  { value: "MOK", label: "MOK", desc: "Match or Kill: Must fill the ENTIRE volume immediately at Market Price. If full quantity isn't available, the whole order is cancelled." },
  { value: "PLO", label: "PLO", desc: "Post Limit Order: Fixed price order for the Post-Close session (14:45-15:00). Can only match at the Closing Price." },
];

const STOCK_NAMES: Record<string, { vn: string; en: string; zh: string }> = {
  'VNM': { vn: 'Vinamilk', en: 'Vinamilk', zh: '越南乳業' },
  'VIC': { vn: 'Vingroup', en: 'Vingroup', zh: '溫納集團' },
  'VHM': { vn: 'Vinhomes', en: 'Vinhomes', zh: '溫納豪宅' },
  'VCB': { vn: 'Vietcombank', en: 'Vietcombank', zh: '越南外貿銀行' },
  'HPG': { vn: 'Hòa Phát', en: 'Hoa Phat Group', zh: '和發集團' },
  'ACB': { vn: 'Ngân hàng Á Châu', en: 'Asia Commercial Bank', zh: '亞洲商業銀行' },
  'FPT': { vn: 'FPT Corp', en: 'FPT Corp', zh: 'FPT 集團' },
  'TCB': { vn: 'Techcombank', en: 'Techcombank', zh: '越南科技商業銀行' },
  'VPB': { vn: 'VPBank', en: 'VPBank', zh: '越南繁榮銀行' },
  'MBB': { vn: 'MBBank', en: 'MBBank', zh: '軍隊銀行' },
  'BID': { vn: 'BIDV', en: 'BIDV', zh: '越南投資發展銀行' },
  'CTG': { vn: 'VietinBank', en: 'VietinBank', zh: '越南工商銀行' },
  'MSN': { vn: 'Masan Group', en: 'Masan Group', zh: '馬山集團' },
  'MWG': { vn: 'Thế Giới Di Động', en: 'Mobile World', zh: '移動世界' },
  'GVR': { vn: 'Tập đoàn Cao su', en: 'Vietnam Rubber Group', zh: '越南橡膠集團' },
  'STB': { vn: 'Sacombank', en: 'Sacombank', zh: '西貢商信銀行' },
  'SSI': { vn: 'Chứng khoán SSI', en: 'SSI Securities', zh: 'SSI 證券' },
  'VND': { vn: 'VNDirect', en: 'VNDirect', zh: 'VNDirect 證券' },
  'DGC': { vn: 'Hóa chất Đức Giang', en: 'Duc Giang Chemicals', zh: '德江化工' },
  'REE': { vn: 'Cơ Điện Lạnh', en: 'REE Corp', zh: 'REE 機電' },
  'PNJ': { vn: 'Vàng bạc Phú Nhuận', en: 'Phu Nhuan Jewelry', zh: '富潤珠寶' },
  'POW': { vn: 'PV Power', en: 'PV Power', zh: '越南油氣電力' },
  'SAB': { vn: 'Sabeco', en: 'Sabeco', zh: '西貢啤酒' },
  'GAS': { vn: 'PV Gas', en: 'PV Gas', zh: '越南油氣' },
  'NVL': { vn: 'Novaland', en: 'Novaland', zh: 'Novaland 地產' },
  'PVS': { vn: 'Dịch vụ Dầu khí', en: 'PTSC', zh: '越南石油技術服務' },
  'SHB': { vn: 'Ngân hàng SHB', en: 'SHB Bank', zh: '西貢-河內銀行' },
  'PVI': { vn: 'PVI Holdings', en: 'PVI Holdings', zh: 'PVI 控股' },
  'ACV': { vn: 'Cảng Hàng không', en: 'Airports Corp', zh: '越南航空港' },
  'BSR': { vn: 'Lọc hóa Dầu Bình Sơn', en: 'Binh Son Refining', zh: '平山煉油石化' },
};

const INITIAL_MARKET_DATA: StockData[] = [
  { symbol: 'VNM', name: 'Vinamilk', ref: 77.3, ceil: 82.5, floor: 72.1, price: 78.5, vol: 2500000, change: 1.55, absChange: 1.2, open: 77.3, high: 79.0, low: 77.0, board: 'HOSE', marketCap: '159,000 B' },
  { symbol: 'VIC', name: 'Vingroup', ref: 43.1, ceil: 46.1, floor: 40.1, price: 42.3, vol: 1800000, change: -1.86, absChange: -0.8, open: 43.0, high: 43.5, low: 42.0, board: 'HOSE', marketCap: '160,000 B' },
  { symbol: 'VHM', name: 'Vinhomes', ref: 39.0, ceil: 41.7, floor: 36.3, price: 39.6, vol: 3200000, change: 1.54, absChange: 0.6, open: 39.1, high: 40.0, low: 39.0, board: 'HOSE', marketCap: '170,000 B' },
  { symbol: 'VCB', name: 'Vietcombank', ref: 86.1, ceil: 92.1, floor: 80.1, price: 88.2, vol: 900000, change: 2.44, absChange: 2.1, open: 86.5, high: 88.5, low: 86.2, board: 'HOSE', marketCap: '500,000 B' },
  { symbol: 'HPG', name: 'Hòa Phát', ref: 25.8, ceil: 27.6, floor: 24.0, price: 25.4, vol: 12400000, change: -1.74, absChange: -0.4, open: 25.7, high: 26.0, low: 25.3, board: 'HOSE', marketCap: '160,000 B' },
  { symbol: 'ACB', name: 'Ngân hàng Á Châu', ref: 24.5, ceil: 26.2, floor: 22.8, price: 24.8, vol: 5600000, change: 1.22, absChange: 0.3, open: 24.5, high: 25.0, low: 24.5, board: 'HOSE', marketCap: '95,000 B' },
  { symbol: 'FPT', name: 'FPT Corp', ref: 122.4, ceil: 130.9, floor: 113.9, price: 125.6, vol: 2100000, change: 2.61, absChange: 3.2, open: 123.0, high: 126.5, low: 122.8, board: 'HOSE', marketCap: '180,000 B' },
  { symbol: 'TCB', name: 'Techcombank', ref: 34.0, ceil: 36.3, floor: 31.7, price: 34.8, vol: 4500000, change: 2.35, absChange: 0.8, open: 34.1, high: 35.0, low: 34.0, board: 'HOSE', marketCap: '120,000 B' },
  { symbol: 'VPB', name: 'VPBank', ref: 19.5, ceil: 20.8, floor: 18.2, price: 19.8, vol: 8900000, change: 1.54, absChange: 0.3, open: 19.6, high: 19.9, low: 19.5, board: 'HOSE', marketCap: '150,000 B' },
  { symbol: 'MBB', name: 'MBBank', ref: 23.5, ceil: 25.1, floor: 21.9, price: 24.1, vol: 7200000, change: 2.55, absChange: 0.6, open: 23.6, high: 24.2, low: 23.5, board: 'HOSE', marketCap: '125,000 B' },
  { symbol: 'BID', name: 'BIDV', ref: 48.0, ceil: 51.3, floor: 44.7, price: 48.5, vol: 1500000, change: 1.04, absChange: 0.5, open: 48.1, high: 48.8, low: 48.0, board: 'HOSE', marketCap: '240,000 B' },
  { symbol: 'CTG', name: 'VietinBank', ref: 33.0, ceil: 35.3, floor: 30.7, price: 33.5, vol: 3400000, change: 1.52, absChange: 0.5, open: 33.1, high: 33.8, low: 33.0, board: 'HOSE', marketCap: '170,000 B' },
  { symbol: 'MSN', name: 'Masan Group', ref: 68.0, ceil: 72.7, floor: 63.3, price: 67.5, vol: 1100000, change: -0.74, absChange: -0.5, open: 68.0, high: 68.5, low: 67.2, board: 'HOSE', marketCap: '95,000 B' },
  { symbol: 'MWG', name: 'Thế Giới Di Động', ref: 45.0, ceil: 48.1, floor: 41.9, price: 46.2, vol: 2800000, change: 2.67, absChange: 1.2, open: 45.2, high: 46.5, low: 45.0, board: 'HOSE', marketCap: '67,000 B' },
  { symbol: 'GVR', name: 'Tập đoàn Cao su', ref: 28.5, ceil: 30.4, floor: 26.6, price: 29.1, vol: 1500000, change: 2.11, absChange: 0.6, open: 28.6, high: 29.3, low: 28.5, board: 'HOSE', marketCap: '115,000 B' },
  { symbol: 'STB', name: 'Sacombank', ref: 30.0, ceil: 32.1, floor: 27.9, price: 30.8, vol: 10500000, change: 2.67, absChange: 0.8, open: 30.2, high: 31.0, low: 30.1, board: 'HOSE', marketCap: '56,000 B' },
  { symbol: 'SSI', name: 'Chứng khoán SSI', ref: 35.0, ceil: 37.4, floor: 32.6, price: 35.8, vol: 8100000, change: 2.29, absChange: 0.8, open: 35.1, high: 36.0, low: 35.0, board: 'HOSE', marketCap: '53,000 B' },
  { symbol: 'VND', name: 'VNDirect', ref: 22.0, ceil: 23.5, floor: 20.5, price: 22.4, vol: 12500000, change: 1.82, absChange: 0.4, open: 22.1, high: 22.6, low: 22.0, board: 'HOSE', marketCap: '27,000 B' },
  { symbol: 'DGC', name: 'Hóa chất Đức Giang', ref: 110.0, ceil: 117.7, floor: 102.3, price: 112.5, vol: 800000, change: 2.27, absChange: 2.5, open: 110.5, high: 113.0, low: 110.0, board: 'HOSE', marketCap: '42,000 B' },
  { symbol: 'REE', name: 'Cơ Điện Lạnh', ref: 62.0, ceil: 66.3, floor: 57.7, price: 62.8, vol: 450000, change: 1.29, absChange: 0.8, open: 62.1, high: 63.0, low: 62.0, board: 'HOSE', marketCap: '25,000 B' },
  { symbol: 'PNJ', name: 'Vàng bạc Phú Nhuận', ref: 98.0, ceil: 104.8, floor: 91.2, price: 99.5, vol: 650000, change: 1.53, absChange: 1.5, open: 98.2, high: 100.0, low: 98.0, board: 'HOSE', marketCap: '32,000 B' },
  { symbol: 'POW', name: 'PV Power', ref: 11.2, ceil: 12.0, floor: 10.4, price: 11.3, vol: 3500000, change: 0.89, absChange: 0.1, open: 11.2, high: 11.4, low: 11.2, board: 'HOSE', marketCap: '26,000 B' },
  { symbol: 'SAB', name: 'Sabeco', ref: 58.0, ceil: 62.0, floor: 54.0, price: 57.5, vol: 300000, change: -0.86, absChange: -0.5, open: 58.0, high: 58.2, low: 57.2, board: 'HOSE', marketCap: '73,000 B' },
  { symbol: 'GAS', name: 'PV Gas', ref: 78.0, ceil: 83.4, floor: 72.6, price: 78.9, vol: 500000, change: 1.15, absChange: 0.9, open: 78.1, high: 79.2, low: 78.0, board: 'HOSE', marketCap: '150,000 B' },
  { symbol: 'NVL', name: 'Novaland', ref: 16.5, ceil: 17.6, floor: 15.4, price: 16.2, vol: 15000000, change: -1.82, absChange: -0.3, open: 16.6, high: 16.7, low: 16.1, board: 'HOSE', marketCap: '31,000 B' },
  { symbol: 'SHB', name: 'Ngân hàng SHB', ref: 11.5, ceil: 12.6, floor: 10.4, price: 11.8, vol: 15200000, change: 2.61, absChange: 0.3, open: 11.6, high: 11.9, low: 11.5, board: 'HOSE', marketCap: '40,000 B' },
  { symbol: 'PVS', name: 'Dịch vụ Dầu khí', ref: 40.2, ceil: 44.2, floor: 36.2, price: 41.5, vol: 3100000, change: 3.23, absChange: 1.3, open: 40.5, high: 42.0, low: 40.5, board: 'HNX', marketCap: '19,000 B' },
  { symbol: 'PVI', name: 'PVI Holdings', ref: 48.0, ceil: 52.8, floor: 43.2, price: 48.5, vol: 50000, change: 1.04, absChange: 0.5, open: 48.0, high: 48.8, low: 48.0, board: 'HNX', marketCap: '11,000 B' },
  { symbol: 'ACV', name: 'Cảng Hàng không', ref: 112.5, ceil: 129.3, floor: 95.7, price: 115.0, vol: 500000, change: 2.22, absChange: 2.5, open: 113.0, high: 116.0, low: 112.8, board: 'UPCOM', marketCap: '240,000 B' },
  { symbol: 'BSR', name: 'Lọc hóa Dầu Bình Sơn', ref: 22.8, ceil: 26.2, floor: 19.4, price: 23.4, vol: 8400000, change: 2.63, absChange: 0.6, open: 22.9, high: 23.6, low: 22.8, board: 'UPCOM', marketCap: '70,000 B' },
];

// --- Custom Hooks ---

const useMarketData = (initialData: StockData[], onUpdatePrices?: (prices: Record<string, number>) => void) => {
  const [marketData, setMarketData] = useState<StockData[]>(initialData);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [priceChanges, setPriceChanges] = useState<Record<string, 'up' | 'down'>>({});

  const onUpdatePricesRef = useRef(onUpdatePrices);
  const isVisibleRef = useRef(true);
  
  useEffect(() => {
    onUpdatePricesRef.current = onUpdatePrices;
  }, [onUpdatePrices]);

  // Handle visibility to pause polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const symbols = useMemo(() => initialData.map(s => s.symbol), []); 

  const syncMarketPrices = useCallback(async () => {
    // Skip if page is hidden
    if (!isVisibleRef.current) return;

    setIsSyncing(true);
    try {
      const result = await getLiveMarketPrices(symbols);
      
      if (result?.prices) {
        setMarketData(prev => {
          let hasChanges = false;
          const newData = prev.map(stock => {
            const apiData = result.prices[stock.symbol];
            
            const apiPrice = typeof apiData === 'number' ? apiData : apiData?.price;
            const apiMarketCap = typeof apiData === 'object' ? apiData?.marketCap : undefined;

            if (apiPrice && apiPrice !== stock.price) {
              hasChanges = true;
              const newAbsChange = apiPrice - stock.ref;
              const newChange = (newAbsChange / stock.ref) * 100;
              return { 
                ...stock, 
                price: apiPrice, 
                absChange: newAbsChange, 
                change: newChange,
                marketCap: apiMarketCap || stock.marketCap 
              };
            } else if (apiMarketCap && apiMarketCap !== stock.marketCap) {
                hasChanges = true;
                return { ...stock, marketCap: apiMarketCap };
            }
            return stock; // Return existing object ref if no change
          });
          
          return hasChanges ? newData : prev;
        });
        
        if (result.sources && result.sources.length > 0) {
            setDataSources(result.sources);
        }
        
        const priceMap: Record<string, number> = {};
        Object.entries(result.prices).forEach(([k, v]) => {
            priceMap[k] = typeof v === 'number' ? v : (v as any).price;
        });

        if (onUpdatePricesRef.current) onUpdatePricesRef.current(priceMap);
      }
    } catch (error) {
      console.error("Market sync error", error);
    } finally {
      setIsSyncing(false);
    }
  }, [symbols]);

  useEffect(() => {
    // Initial fetch
    syncMarketPrices();
    // Poll API every 30 seconds (optimized from 2 mins, but paused when hidden)
    const syncInterval = setInterval(syncMarketPrices, 30000);
    return () => clearInterval(syncInterval);
  }, [syncMarketPrices]);

  return { marketData, dataSources, isSyncing, priceChanges, syncMarketPrices };
};

// --- Sub-Components (Memoized) ---

const OrderTypeTooltip = memo(({ type }: { type: string }) => {
  const info = ORDER_TYPES.find(t => t.value === type);
  if (!info) return null;
  
  return (
    <div className="group relative inline-flex items-center ml-2">
      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-[#00a2bd] transition-colors cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#1e222d] text-white text-[11px] leading-relaxed rounded-lg shadow-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[60] backdrop-blur-md">
        <div className="font-bold mb-1.5 text-[#00a2bd] border-b border-white/10 pb-1">{info?.label}</div>
        {info?.desc}
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e222d] border-b border-r border-white/10 rotate-45"></div>
      </div>
    </div>
  );
});

const SidebarAnalysis = memo(({ symbol, price }: { symbol: string, price: number }) => {
  const { lang } = useLanguage();
  const [analysis, setAnalysis] = useState<{ sentiment: string, content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchAnalysis = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    setExpanded(true);
    try {
      const result = await getSymbolAnalysis(symbol, price.toString(), lang);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  // Reset when symbol changes
  useEffect(() => {
    setAnalysis(null);
    setExpanded(false);
  }, [symbol]);

  return (
    <div className="mx-4 mt-2 mb-4">
      <div className={`bg-gradient-to-br from-[#00a2bd]/5 to-transparent border border-[#00a2bd]/20 rounded-xl overflow-hidden transition-all duration-300 ${expanded ? 'shadow-lg' : 'hover:bg-[#00a2bd]/5'}`}>
        {!expanded ? (
          <div className="p-3 flex items-center justify-between cursor-pointer" onClick={fetchAnalysis}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00a2bd]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Insight: {symbol}</span>
            </div>
            <button className="p-1 rounded-full hover:bg-[#00a2bd]/10 transition-colors">
              <ChevronRight className="w-4 h-4 text-[#00a2bd]" />
            </button>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#00a2bd]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00a2bd]">Market Intelligence</span>
              </div>
              <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-black dark:hover:text-white"><X className="w-3 h-3" /></button>
            </div>
            
            {loading ? (
              <div className="flex flex-col gap-2 animate-pulse">
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
              </div>
            ) : analysis ? (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[9px] py-0.5 px-2 border-0 ${
                    analysis.sentiment.includes('Bullish') ? 'bg-green-500/10 text-green-600' : 
                    analysis.sentiment.includes('Bearish') ? 'bg-red-500/10 text-red-600' : 
                    'bg-gray-500/10 text-gray-600'
                  }`}>
                    {analysis.sentiment.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-[10px] leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-4">
                  {analysis.content}
                </p>
              </div>
            ) : (
              <div className="text-center py-2 text-[10px] text-gray-400">Unable to analyze.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// --- New Components Definitions ---

const MarketTicker = memo(({ stocks, onSelect }: { stocks: StockData[], onSelect: (s: string) => void }) => (
  <div className="w-full bg-[#0a0a0b] text-white border-b border-white/5 overflow-hidden h-10 flex items-center relative z-20 shadow-xl">
    {/* Live Label */}
    <div className="bg-[#00a2bd] h-full flex items-center px-4 z-30 relative shrink-0">
        <Activity className="w-4 h-4 mr-2 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">Live Market</span>
        {/* Angled separator */}
        <div className="absolute right-[-10px] top-0 bottom-0 w-4 bg-[#00a2bd] transform skew-x-[-20deg]" />
    </div>

    <div className="flex-1 overflow-hidden relative ml-4">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0b] to-transparent z-20 pointer-events-none" />
        
        {/* Ticker container - pauses on hover */}
        <div className="flex animate-ticker whitespace-nowrap hover:[animation-play-state:paused] w-full items-center h-full" style={{ willChange: 'transform' }}>
        {/* Duplicate list 4 times for smooth infinite scroll */}
        {[...stocks, ...stocks, ...stocks, ...stocks].map((stock, i) => (
            <button
            key={`${stock.symbol}-${i}`}
            onClick={() => onSelect(stock.symbol)}
            className="flex items-center gap-4 px-6 border-r border-white/10 hover:bg-white/5 transition-colors h-full group"
            >
            <span className="font-bold text-xs group-hover:text-[#00a2bd] transition-colors">{stock.symbol}</span>
            <span className={`text-xs font-mono font-bold ${stock.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {stock.price.toFixed(2)}
            </span>
            <span className={`text-[10px] font-bold flex items-center gap-1 ${stock.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stock.change).toFixed(2)}%
            </span>
            </button>
        ))}
        </div>

        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0b] to-transparent z-20 pointer-events-none" />
    </div>
  </div>
));

const WatchlistItem = memo(({ stock, isSelected, onSelect, priceChange, isFlashing }: { stock: StockData, isSelected: boolean, onSelect: (s: string) => void, priceChange?: 'up' | 'down', isFlashing: boolean }) => (
  <div
    onClick={() => onSelect(stock.symbol)}
    className={`
      grid grid-cols-[1.2fr_1fr_1fr_1.2fr] items-center p-4 border-b border-gray-100 dark:border-white/5 cursor-pointer transition-all gap-2
      ${isSelected ? 'bg-[#f1f3f5] dark:bg-white/5 border-l-4 border-l-[#00a2bd]' : 'hover:bg-[#f8f9fa] dark:hover:bg-white/[0.02] border-l-4 border-l-transparent'}
      ${isFlashing ? 'animate-flash-row' : ''}
    `}
  >
    <div>
      <div className="font-bold text-sm">{stock.symbol}</div>
      <div className="text-[10px] text-gray-400 truncate max-w-[100px]">{stock.name}</div>
    </div>
    <div className={`text-right font-mono text-sm font-bold transition-colors duration-300 ${priceChange === 'up' ? 'text-[#22c55e]' : priceChange === 'down' ? 'text-[#ef4444]' : ''}`}>
      {stock.price.toFixed(2)}
    </div>
    <div className={`text-right text-xs font-bold ${stock.change >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
      {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
    </div>
    <div className="text-right text-[10px] font-mono font-medium text-gray-500 truncate">
      {stock.marketCap || '-'}
    </div>
  </div>
));

const TradingChart = memo(({ symbol, price, basePrice, onAnalyze }: { symbol: string, price: number, basePrice: number, onAnalyze: () => void }) => {
  const [data, setData] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate initial candle data only when symbol or basePrice changes
    const initial = Array.from({ length: 40 }, () => basePrice * (1 + (Math.random() - 0.5) * 0.02));
    setData(initial);
  }, [symbol, basePrice]);

  useEffect(() => {
    // Update last point with current price
    setData(prev => {
        const newData = [...prev];
        if (newData.length > 0) {
            newData[newData.length - 1] = price;
        }
        return newData;
    });
  }, [price]);

  // Simple SVG Path
  const width = 800;
  const height = 300;
  const max = Math.max(...data, price * 1.01);
  const min = Math.min(...data, price * 0.99);
  const range = max - min || 1;
  
  const points = useMemo(() => data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' '), [data, min, range]);

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const isUp = price >= basePrice;
  const color = isUp ? '#22c55e' : '#ef4444';

  return (
    <div className="w-full h-full relative group bg-white dark:bg-[#0f0f0f] rounded-lg overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
             <defs>
                <linearGradient id={`chartGradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
                    <stop offset="100%" stopColor={color} stopOpacity="0"/>
                </linearGradient>
            </defs>
            <path d={areaPoints} fill={`url(#chartGradient-${symbol})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-black/5 dark:bg-white/10 text-gray-500 border-0">1D</Badge>
            <Badge className="bg-transparent text-gray-400 border border-gray-200 dark:border-white/10">1W</Badge>
        </div>
        <button 
            onClick={onAnalyze}
            className="absolute top-4 right-4 bg-white dark:bg-[#1a1a1a] p-2 rounded-full shadow-lg border border-gray-100 dark:border-white/10 hover:scale-110 transition-transform text-[#00a2bd]"
        >
            <BrainCircuit className="w-4 h-4" />
        </button>
    </div>
  );
});

const OrderBook = memo(({ symbol, currentPrice }: { symbol: string, currentPrice: number }) => {
    // Memoize level generation to avoid jitter unless price changes significantly
    const { bids, asks } = useMemo(() => {
        const generateLevels = (price: number, type: 'bid' | 'ask') => {
            return Array.from({ length: 5 }, (_, i) => ({
                price: type === 'bid' ? price - (i + 1) * 0.1 : price + (i + 1) * 0.1,
                qty: Math.floor(Math.random() * 5000) + 100,
                percent: Math.random() * 100
            }));
        };
        return {
            bids: generateLevels(currentPrice, 'bid'),
            asks: generateLevels(currentPrice, 'ask').reverse()
        };
    }, [currentPrice, symbol]); // Regenerate only on price change

    return (
        <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 p-4 flex flex-col h-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-100 dark:border-white/5 pb-2">Order Book</h3>
            <div className="flex-1 overflow-hidden flex flex-col gap-1">
                 {asks.map((ask, i) => (
                    <div key={`ask-${i}`} className="flex justify-between items-center text-xs relative h-6">
                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all duration-300" style={{ width: `${ask.percent}%` }} />
                        <span className="relative z-10 text-gray-400">{new Intl.NumberFormat('en-US', { notation: "compact" }).format(ask.qty)}</span>
                        <span className="relative z-10 font-mono text-[#ef4444] font-bold">{ask.price.toFixed(2)}</span>
                    </div>
                 ))}
                 <div className="py-2 text-center font-bold text-lg font-mono border-y border-dashed border-gray-200 dark:border-white/10 my-1">
                     {currentPrice.toFixed(2)}
                 </div>
                 {bids.map((bid, i) => (
                    <div key={`bid-${i}`} className="flex justify-between items-center text-xs relative h-6">
                        <div className="absolute left-0 top-0 bottom-0 bg-green-500/10 transition-all duration-300" style={{ width: `${bid.percent}%` }} />
                        <span className="relative z-10 font-mono text-[#22c55e] font-bold">{bid.price.toFixed(2)}</span>
                        <span className="relative z-10 text-gray-400">{new Intl.NumberFormat('en-US', { notation: "compact" }).format(bid.qty)}</span>
                    </div>
                 ))}
            </div>
        </div>
    );
});

const StockAnalysisModal = ({ symbol, price, side, onClose }: { symbol: string, price: number, side: string, onClose: () => void }) => {
    const { lang } = useLanguage();
    const [analysis, setAnalysis] = useState<{ sentiment: string, content: string, sources: any[], timestamp: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchAnalysis = async () => {
            try {
                const result = await getSymbolAnalysis(symbol, price.toString(), lang);
                if (mounted) {
                    setAnalysis(result);
                    setLoading(false);
                }
            } catch (error) {
                if (mounted) setLoading(false);
            }
        };
        fetchAnalysis();
        return () => { mounted = false; };
    }, [symbol, price, lang]);

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fadeIn">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#101010] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#151515]">
                    <div className="flex items-center gap-3">
                        <BrainCircuit className="w-6 h-6 text-[#00a2bd]" />
                        <div>
                             <h3 className="font-bold text-lg">AI Market Intelligence</h3>
                             <p className="text-[10px] text-gray-500 uppercase tracking-widest">Real-time Analysis • Gemini 3.0 Flash</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="p-8 overflow-y-auto">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="pt-4 flex gap-4">
                                <Skeleton className="h-20 w-full rounded-lg" />
                                <Skeleton className="h-20 w-full rounded-lg" />
                            </div>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Badge className={`text-sm py-1 px-3 ${
                                    analysis.sentiment.includes('Bullish') ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                                    analysis.sentiment.includes('Bearish') ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                                    'bg-gray-500/10 text-gray-600 border-gray-500/20'
                                }`}>
                                    {analysis.sentiment.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-400 font-mono">Updated: {analysis.timestamp}</span>
                            </div>
                            
                            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line">
                                {analysis.content}
                            </div>

                            {analysis.sources.length > 0 && (
                                <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Grounding Sources (Verified)
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.sources.map((s, i) => (
                                            <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 hover:bg-[#00a2bd]/10 hover:text-[#00a2bd] px-3 py-1.5 rounded text-xs transition-colors border border-gray-200 dark:border-white/10 max-w-full">
                                                <span className="truncate max-w-[200px]">{s.title}</span>
                                                <ArrowUpRight className="w-3 h-3 shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Analysis currently unavailable.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ActiveStockDisplay = memo(({ activeStock, priceChange, onAnalyze, t }: { activeStock: StockData, priceChange?: string, onAnalyze: () => void, t: any }) => {
  return (
    <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 p-6 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-black tracking-tight">{activeStock.symbol}</h2>
          <div className="flex flex-col">
            <Badge className={`${activeStock.change >= 0 ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#ef4444]/10 text-[#ef4444]'} border-0 px-2 py-0.5 text-[10px]`}>
              {activeStock.change >= 0 ? '+' : ''}{activeStock.change.toFixed(2)}%
            </Badge>
            <div className="text-xs text-gray-500 mt-1">{activeStock.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-mono font-bold transition-colors duration-500 ${
            priceChange === 'up' ? 'text-green-500' : priceChange === 'down' ? 'text-red-500' : 'text-black dark:text-white'
          }`}>
            {activeStock.price.toFixed(3)}
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">VNĐ (x1000)</div>
        </div>
      </div>

      <div className="flex-grow aspect-[21/9]">
        <TradingChart 
          symbol={activeStock.symbol} 
          price={activeStock.price} 
          basePrice={activeStock.ref} 
          onAnalyze={onAnalyze}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: t.trading.open, value: activeStock.open.toFixed(3) },
            { label: t.trading.high, value: activeStock.high.toFixed(3), cls: 'text-green-500' },
            { label: t.trading.low, value: activeStock.low.toFixed(3), cls: 'text-red-500' },
            { label: t.trading.volume, value: new Intl.NumberFormat('en-US', { notation: "compact" }).format(activeStock.vol) }
          ].map((stat, i) => (
            <div key={i} className="bg-[#f8f9fa] dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
              <div className={`text-sm font-mono font-bold ${stat.cls || 'text-gray-900 dark:text-white'}`}>{stat.value}</div>
            </div>
          ))}
      </div>
    </div>
  );
});

const ExecutionPanel = memo(({ activeStock, onPlaceOrder, onAnalyze, t }: { activeStock: StockData, onPlaceOrder: any, onAnalyze: () => void, t: any }) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<number>(100);
  const [priceInput, setPriceInput] = useState<string>(activeStock.price.toFixed(3));
  const [orderType, setOrderType] = useState('Limit');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [triggerPrice, setTriggerPrice] = useState<string>('');
  
  // Custom Dropdown State
  const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false);
  const orderTypeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (orderTypeDropdownRef.current && !orderTypeDropdownRef.current.contains(event.target as Node)) {
            setIsOrderTypeOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (orderType !== 'Limit') setPriceInput(activeStock.price.toFixed(3));
  }, [activeStock.price, orderType]);

  const handlePlaceOrderInternal = () => {
    if (!quantity || quantity <= 0) return;
    const priceNum = parseFloat(priceInput.replace(',', ''));
    if (orderType === 'Limit' && isNaN(priceNum)) return;

    onPlaceOrder({
      symbol: activeStock.symbol,
      qty: quantity,
      price: orderType === 'Market' ? activeStock.price : priceNum,
      side: side === 'buy' ? 'Buy' : 'Sell'
    });
  };

  const applyOffset = (type: 'SL' | 'TP', percentage: number) => {
    const base = parseFloat(priceInput.replace(',', '')) || activeStock.price;
    const factor = percentage / 100;
    if (type === 'SL') {
      const val = side === 'buy' ? base * (1 - factor) : base * (1 + factor);
      setStopLoss(val.toFixed(3));
    } else {
      const val = side === 'buy' ? base * (1 + factor) : base * (1 - factor);
      setTakeProfit(val.toFixed(3));
    }
  };

  const getOrderTypeId = (type: string) => {
    if (type === 'Limit') return 'LO';
    if (type === 'Market') return 'MP';
    return type;
  };

  const selectedOrderInfo = ORDER_TYPES.find(ot => ot.value === getOrderTypeId(orderType));

  return (
    <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold uppercase tracking-tight">{t.trading.execution}</h3>
        <div className="flex gap-2">
            <Badge className="bg-gray-100 dark:bg-white/5 text-gray-500 border-0">{t.trading.power}: 1,240,000,000 đ</Badge>
        </div>
      </div>
      
      <div className="flex bg-[#f1f3f5] dark:bg-white/5 p-1 rounded-full mb-8 max-w-[240px]">
        <button onClick={() => setSide('buy')} className={`flex-1 py-2 rounded-full font-black text-[10px] tracking-widest transition-all ${side === 'buy' ? 'bg-[#22c55e] text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}>{t.trading.buyBtn}</button>
        <button onClick={() => setSide('sell')} className={`flex-1 py-2 rounded-full font-black text-[10px] tracking-widest transition-all ${side === 'sell' ? 'bg-[#ef4444] text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}>{t.trading.sellBtn}</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <ListTodo className="w-3 h-3" /> {t.trading.orderType}
                <OrderTypeTooltip type={getOrderTypeId(orderType)} />
              </label>
            </div>
            <div className="flex gap-2 relative z-50">
                <div className="relative flex-1" ref={orderTypeDropdownRef}>
                    <button
                        onClick={() => setIsOrderTypeOpen(!isOrderTypeOpen)}
                        className="w-full bg-[#f1f3f5] dark:bg-white/5 rounded-xl p-4 text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-[#00a2bd] outline-none flex items-center justify-between transition-all hover:bg-[#e9ecef] dark:hover:bg-white/10"
                    >
                        <span>{ORDER_TYPES.find(t => t.value === getOrderTypeId(orderType))?.label}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOrderTypeOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top ${isOrderTypeOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {ORDER_TYPES.map((type) => (
                                <div 
                                    key={type.value}
                                    className="group relative flex items-center justify-between px-4 py-3 hover:bg-[#f8f9fa] dark:hover:bg-white/5 cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors"
                                    onClick={() => {
                                        setOrderType(type.value === 'LO' ? 'Limit' : type.value === 'MP' ? 'Market' : type.value);
                                        setIsOrderTypeOpen(false);
                                    }}
                                >
                                    <span className={`text-xs font-bold font-mono uppercase ${getOrderTypeId(orderType) === type.value ? 'text-[#00a2bd]' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {type.label}
                                    </span>
                                    
                                    {/* Info Icon with Tooltip */}
                                    <div className="group/tooltip relative p-1" onClick={(e) => e.stopPropagation()}>
                                        <Info className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#00a2bd] transition-colors" />
                                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 w-48 p-3 bg-[#0b1221] text-white text-[10px] leading-relaxed rounded-lg shadow-xl border border-white/10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-[110] backdrop-blur-md">
                                            <div className="font-bold mb-1 text-[#00a2bd]">{type.label}</div>
                                            {type.desc}
                                            {/* Arrow */}
                                            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0b1221] border-t border-r border-white/10 rotate-45 transform translate-x-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onAnalyze}
                    className="bg-[#00a2bd]/10 text-[#00a2bd] border border-[#00a2bd]/20 rounded-xl w-14 flex items-center justify-center hover:bg-[#00a2bd]/20 transition-all group relative overflow-hidden"
                    title={t.trading.aiAnalysis}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00a2bd]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
            
            {/* Dynamic Info Block for Order Type */}
            {selectedOrderInfo && (
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5 flex gap-2 animate-fadeIn mt-2">
                    <Info className="w-3 h-3 text-[#00a2bd] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        {selectedOrderInfo.desc}
                    </p>
                </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" /> {t.trading.quantity}
            </label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full bg-[#f1f3f5] dark:bg-white/5 rounded-xl p-4 text-xl font-mono font-bold focus:ring-2 focus:ring-[#00a2bd] outline-none transition-all" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.trading.limitPrice}</label>
              {orderType === 'Limit' && (
                  <div className="flex gap-2">
                      <span className="text-[9px] font-bold text-[#00a2bd] bg-[#00a2bd]/10 px-1.5 rounded">{activeStock.floor}</span>
                      <span className="text-[9px] font-bold text-[#f23645] bg-[#f23645]/10 px-1.5 rounded">{activeStock.ceil}</span>
                  </div>
              )}
            </div>
            <input 
              type="text" 
              value={orderType === 'Market' ? 'MP' : priceInput} 
              onChange={(e) => setPriceInput(e.target.value)} 
              disabled={orderType !== 'Limit'}
              className={`w-full bg-[#f1f3f5] dark:bg-white/5 rounded-xl p-4 text-xl font-mono font-bold focus:ring-2 focus:ring-[#00a2bd] outline-none transition-all ${orderType !== 'Limit' ? 'opacity-50 cursor-not-allowed' : ''}`} 
            />
            {orderType === 'Limit' && (
              <div className="pt-2 px-1">
                <input 
                  type="range" 
                  min={activeStock.floor} 
                  max={activeStock.ceil} 
                  step={0.1}
                  value={parseFloat(priceInput) || activeStock.price}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-[#00a2bd]"
                />
                <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-mono">
                  <span>{t.trading.floor}</span>
                  <span className="text-center">{((activeStock.floor + activeStock.ceil) / 2).toFixed(2)}</span>
                  <span>{t.trading.ceiling}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 border-l border-r border-black/5 dark:border-white/5 px-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-red-500" /> {t.trading.stopLoss}
            </label>
            <input type="text" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="0.000" className="w-full bg-[#f1f3f5] dark:bg-white/5 rounded-xl p-3 text-lg font-mono font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all" />
            <div className="flex gap-2">
              <button onClick={() => applyOffset('SL', 2)} className="text-[9px] font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">-2%</button>
              <button onClick={() => applyOffset('SL', 5)} className="text-[9px] font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">-5%</button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
              <Target className="w-3 h-3 text-green-500" /> {t.trading.takeProfit}
            </label>
            <input type="text" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="0.000" className="w-full bg-[#f1f3f5] dark:bg-white/5 rounded-xl p-3 text-lg font-mono font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all" />
            <div className="flex gap-2">
              <button onClick={() => applyOffset('TP', 5)} className="text-[9px] font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">+5%</button>
              <button onClick={() => applyOffset('TP', 10)} className="text-[9px] font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">+10%</button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.trading.trigger}</label>
            <input type="text" value={triggerPrice} onChange={(e) => setTriggerPrice(e.target.value)} placeholder="0.000" className="w-full bg-[#f1f3f5] dark:bg-white/5 rounded-xl p-3 text-lg font-mono font-bold focus:ring-2 focus:ring-[#00a2bd] outline-none transition-all" />
          </div>
        </div>

        <div className="flex flex-col justify-end gap-6">
          <div className="bg-[#f8f9fa] dark:bg-white/5 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">{t.trading.value}:</span>
                <span className="font-mono font-bold text-lg">{new Intl.NumberFormat().format(quantity * (parseFloat(priceInput.replace(',', '')) || activeStock.price) * 1000)} đ</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400">{t.trading.ratio}:</span>
                <span className="text-gray-500 font-bold uppercase">Dynamic Calculation</span>
              </div>
          </div>
          <button 
            onClick={handlePlaceOrderInternal}
            className={`w-full py-5 rounded-2xl font-black text-white text-base tracking-widest shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${side === 'buy' ? 'bg-[#22c55e] hover:bg-[#16a34a]' : 'bg-[#ef4444] hover:bg-[#dc2626]'}`}
          >
            {side === 'buy' ? t.trading.executeBuy : t.trading.executeSell}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

// --- Main Section Component ---

const TradingSection: React.FC<{
  onPlaceOrder?: (order: { symbol: string; qty: number; price: number; side: 'Buy' | 'Sell' }) => void;
  onUpdatePrices?: (prices: Record<string, number>) => void;
  positions?: any[];
}> = ({ onPlaceOrder, onUpdatePrices }) => {
  const { marketData: rawMarketData, dataSources, isSyncing, priceChanges, syncMarketPrices } = useMarketData(INITIAL_MARKET_DATA, onUpdatePrices);
  const { t, lang } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('VNM');
  const [activeBoard, setActiveBoard] = useState<'HOSE' | 'HNX' | 'UPCOM'>('HOSE');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [flashingSymbol, setFlashingSymbol] = useState<string | null>(null);
  const [toasts, setToasts] = useState<any[]>([]);
  
  // Real-time ticker state
  const [tickerData, setTickerData] = useState<StockData[]>([]);

  // Dynamically translate stock names based on current language
  const marketData = useMemo(() => {
    return rawMarketData.map(stock => ({
        ...stock,
        name: STOCK_NAMES[stock.symbol] ? STOCK_NAMES[stock.symbol][lang] : stock.name
    }));
  }, [rawMarketData, lang]);

  const activeStock = useMemo(() => 
    marketData.find(s => s.symbol === selectedSymbol) || marketData[0]
  , [selectedSymbol, marketData]);

  // Sync Ticker Data with Authoritative API Data
  useEffect(() => {
    const targetSymbols = ['VNM', 'HPG', 'FPT', 'ACB', 'VCB'];
    const updatedTicker = targetSymbols.map(sym => marketData.find(s => s.symbol === sym)).filter(Boolean) as StockData[];
    setTickerData(updatedTicker);
  }, [marketData]);

  // Live Ticker Simulation (Micro-movements to emulate WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
        setTickerData(prev => prev.map(stock => {
            // 30% chance to update price to reduce noise
            if (Math.random() > 0.3) return stock;
            
            const volatility = 0.05; // Small tick size
            const direction = Math.random() > 0.5 ? 1 : -1;
            let change = Number((Math.random() * volatility).toFixed(2)) * direction;
            
            // Bias towards original reference to prevent drifting too far
            if (stock.price > stock.ref * 1.05) change = -0.05;
            if (stock.price < stock.ref * 0.95) change = 0.05;

            let newPrice = stock.price + change;
            // Keep within floor/ceil
            newPrice = Math.max(stock.floor, Math.min(stock.ceil, newPrice));
            
            const newAbsChange = newPrice - stock.ref;
            const newPercentChange = (newAbsChange / stock.ref) * 100;

            return {
                ...stock,
                price: Number(newPrice.toFixed(2)),
                change: Number(newPercentChange.toFixed(2)),
                absChange: Number(newAbsChange.toFixed(2))
            };
        }));
    }, 2000); // Ticks every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredDataByBoard = useMemo(() => {
    const base = marketData.filter(s => s.board === activeBoard);
    if (!searchQuery) return base;
    const query = searchQuery.toLowerCase();
    return base.filter(s => s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query));
  }, [marketData, activeBoard, searchQuery]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const handleSelectSymbol = useCallback((symbol: string) => {
    setSelectedSymbol(symbol);
  }, []);

  const handlePlaceOrderWrapper = useCallback((order: any) => {
    if (onPlaceOrder) {
      try {
        onPlaceOrder(order);
        setFlashingSymbol(order.symbol);
        setTimeout(() => setFlashingSymbol(null), 1000);
        addToast(`Order submitted: ${order.side.toUpperCase()} ${order.qty} ${order.symbol}`, "success");
      } catch (error: any) {
        addToast(error.message || "Order placement failed.", "error");
      }
    }
  }, [onPlaceOrder, addToast]);

  return (
    <section id="trading" className="bg-[#f2f4f7] dark:bg-[#050505] py-12 text-black dark:text-white transition-colors duration-500 relative">
      <div className="fixed top-24 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-fadeIn min-w-[320px] ${
              toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-bold flex-1">{toast.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="hover:opacity-50 transition-opacity"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <MarketTicker stocks={tickerData} onSelect={handleSelectSymbol} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 grid lg:grid-cols-[350px_1fr] gap-6">
        <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 flex flex-col overflow-hidden h-fit max-h-[90vh]">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex bg-[#f1f3f5] dark:bg-white/5 p-1 rounded-lg">
                {(['HOSE', 'HNX', 'UPCOM'] as const).map(b => (
                  <button 
                    key={b}
                    onClick={() => setActiveBoard(b)}
                    className={`px-3 py-1.5 text-[9px] font-black tracking-widest uppercase rounded-md transition-all ${activeBoard === b ? 'bg-white dark:bg-white/10 shadow-sm text-[#00a2bd]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <button 
                onClick={syncMarketPrices}
                disabled={isSyncing}
                className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all ${isSyncing ? 'animate-spin text-[#00a2bd]' : 'text-gray-400'}`}
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00a2bd] transition-colors" />
              <input 
                type="text" 
                placeholder={t.trading.search}
                className="w-full bg-[#f1f3f5] dark:bg-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#00a2bd]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] px-4 py-2 text-[9px] font-black uppercase text-gray-400 tracking-widest gap-2">
                <div>{t.trading.symbol}</div>
                <div className="text-right">{t.trading.price}</div>
                <div className="text-right">{t.trading.change}</div>
                <div className="text-right">{t.trading.marketCap}</div>
            </div>
          </div>
          
          <SidebarAnalysis symbol={activeStock.symbol} price={activeStock.price} />

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {filteredDataByBoard.map((stock) => (
              <WatchlistItem 
                key={stock.symbol}
                stock={stock}
                isSelected={selectedSymbol === stock.symbol}
                onSelect={handleSelectSymbol}
                priceChange={priceChanges[stock.symbol]}
                isFlashing={flashingSymbol === stock.symbol}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-[1fr_300px] gap-6">
            <ActiveStockDisplay 
              activeStock={activeStock} 
              priceChange={priceChanges[activeStock.symbol]} 
              onAnalyze={() => setShowAnalysis(true)} 
              t={t} 
            />
            <OrderBook symbol={activeStock.symbol} currentPrice={activeStock.price} />
          </div>

          <ExecutionPanel 
            activeStock={activeStock} 
            onPlaceOrder={handlePlaceOrderWrapper} 
            onAnalyze={() => setShowAnalysis(true)} 
            t={t}
          />

          {dataSources.length > 0 && (
            <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl p-6 border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-[#00a2bd]" />
                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500">{t.trading.sourceData}: Google Search Grounding</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {dataSources.map((source, i) => (
                  <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#f8f9fa] dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 text-[9px] font-bold text-gray-500 hover:text-[#00a2bd] transition-all">
                    <Globe className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showAnalysis && (
        <StockAnalysisModal 
          symbol={activeStock.symbol} 
          price={activeStock.price}
          side="buy"
          onClose={() => setShowAnalysis(false)} 
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes market-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: market-ticker 30s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
        @keyframes flash-row {
          0% { background-color: transparent; }
          20% { background-color: rgba(0, 162, 189, 0.2); }
          100% { background-color: transparent; }
        }
        .animate-flash-row {
          animation: flash-row 1s ease-out;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default TradingSection;
