
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import ScrollReveal from './ScrollReveal';
import { Icons } from '../constants';
import { analyzeProductStrategy, getQuickProductSummary } from '../services/geminiService';
import { Button } from './ui/Button';
import { Skeleton } from './ui/Skeleton';
import { BrainCircuit, Sparkles, X, TrendingUp, Shield, Zap, Globe, BarChart3, ArrowUpRight, Layers } from 'lucide-react';

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const width = 200;
  const height = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <div className="w-full h-[50px] sm:h-[60px] mt-4 mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${color.replace('#', '')})`} />
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
        <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height} r="4" fill={color} className="animate-pulse" />
      </svg>
    </div>
  );
};

const ProductModal: React.FC<{ product: any; onClose: () => void }> = ({ product, onClose }) => {
  const { lang } = useLanguage();
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!product) return null;

  const handleAiAnalyze = async () => {
    if (loadingAi) return;
    setLoadingAi(true);
    const result = await analyzeProductStrategy(product.title, product.thesis, lang);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#101010] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0055c8] to-[#20b66e]" />
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors z-20 bg-gray-100 dark:bg-white/10 rounded-full">
          <X className="w-5 h-5" />
        </button>
        
        <div className="overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-[#0055c8] uppercase font-bold tracking-widest text-[10px] mb-3 block">Product Insight</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[#0b1221] dark:text-white">{product.title}</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md border ${product.riskProfile === 'High' ? 'border-red-500/50 text-red-500 bg-red-500/5' : product.riskProfile === 'Medium' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' : 'border-green-500/50 text-green-500 bg-green-500/5'}`}>
                        Risk: {product.riskProfile}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-md border border-gray-200 dark:border-white/10 text-gray-500 bg-gray-50 dark:bg-white/5">
                        AUM: {product.aum}
                    </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#0055c8]" /> Investment Thesis
                  </h4>
                  <p className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">"{product.thesis}"</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-3 h-3 text-[#0055c8]" /> Market Strategy
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">{product.desc}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0055c8]/5 to-transparent p-6 md:p-8 rounded-2xl border border-[#0055c8]/10 relative group">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <h4 className="text-sm font-bold text-[#0055c8] mb-1 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> Gemini Strategy Lab
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">AI-Powered deep analysis</p>
                    </div>
                    {!aiAnalysis && (
                        <button 
                            onClick={handleAiAnalyze}
                            disabled={loadingAi}
                            className="bg-[#0055c8] text-white text-[10px] font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-[#0044a0] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {loadingAi ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Analyze Strategy'}
                        </button>
                    )}
                </div>

                {loadingAi ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded w-5/6"></div>
                    </div>
                ) : aiAnalysis ? (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {aiAnalysis.analysis}
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">Click "Analyze Strategy" to generate a real-time institutional report using Gemini 3.0.</p>
                )}
              </div>
            </div>

            <div className="lg:w-80 space-y-6">
              <div className="bg-white dark:bg-[#151515] p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 pb-2 border-b border-gray-100 dark:border-white/5">Top Holdings</h4>
                <div className="space-y-4">
                  {product.holdings.map((h: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-700 dark:text-gray-200">{h.name}</span>
                      <span className="font-mono text-[#0055c8] font-bold bg-[#0055c8]/10 px-2 py-0.5 rounded text-xs">{h.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full bg-[#0b1221] dark:bg-white text-white dark:text-[#0b1221] py-4 font-bold uppercase text-xs tracking-widest rounded-xl hover:opacity-90 transition-all shadow-xl">Download Factsheet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: any; index: number; onClick: () => void }> = ({ product, index, onClick }) => {
  const { lang, t } = useLanguage();
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAiClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showSummary && !summary) {
        setLoading(true);
        try {
            const res = await getQuickProductSummary(product.title, product.thesis, lang);
            setSummary(res);
        } catch (e) {
            setSummary("Analysis unavailable.");
        } finally {
            setLoading(false);
        }
    }
    setShowSummary(!showSummary);
  };

  return (
    <ScrollReveal direction="up" delay={index * 100} className="group h-full">
      <div 
        className="bg-white dark:bg-[#121212] p-5 md:p-8 h-full border border-gray-200 dark:border-white/5 hover:border-[#0055c8] dark:hover:border-[#0055c8] transition-all duration-300 cursor-pointer rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col relative overflow-hidden group min-h-[380px] md:min-h-[480px]"
        onClick={onClick}
      >
        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Header Section: Icon/Image + Stats */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          {(product.imageUrl && !imgError) ? (
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5">
                <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover" 
                    onError={() => setImgError(true)}
                />
             </div>
          ) : (
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#0055c8] group-hover:bg-[#0055c8] group-hover:text-white transition-all duration-300 shadow-inner">
               {product.icon ? React.cloneElement(product.icon, { className: "w-5 h-5 md:w-6 md:h-6" }) : <Layers className="w-5 h-5 md:w-6 md:h-6" />}
             </div>
          )}
          <div className="text-right">
            <div className="text-xl md:text-2xl font-mono font-bold text-[#0055c8] tracking-tight">{product.statsValue}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">{product.statsLabel}</div>
          </div>
        </div>
        
        {/* Title Section with AI Icon */}
        <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
             <h3 className="text-lg md:text-2xl font-bold tracking-tight text-[#0b1221] dark:text-white group-hover:text-[#0055c8] transition-colors line-clamp-2 min-h-[3rem] md:min-h-[3.5rem] flex-1">
                {product.title}
             </h3>
             <button
                onClick={handleAiClick}
                className={`shrink-0 mt-1 p-1.5 rounded-full transition-all border ${showSummary ? 'bg-[#00a2bd] text-white border-[#00a2bd]' : 'text-gray-400 border-transparent hover:text-[#00a2bd] hover:bg-[#00a2bd]/10'}`}
                title="AI Analysis: Investment Thesis & Summary"
             >
                <BrainCircuit className="w-5 h-5" />
             </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-6 relative z-10">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${product.riskProfile === 'High' ? 'text-red-500 border-red-500/20 bg-red-500/5' : product.riskProfile === 'Medium' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'}`}>
                {product.riskProfile} Risk
            </span>
        </div>
             
        {/* AI Popover - Absolute positioned within card */}
        {showSummary && (
            <div 
            className="absolute top-[80px] left-4 right-4 bottom-20 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-2xl p-5 rounded-xl z-30 animate-fadeIn cursor-default backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#0055c8] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> AI Strategy Analysis
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowSummary(false); }} className="text-gray-400 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-white/10 rounded-full p-1"><X className="w-3 h-3"/></button>
                </div>
                
                <div className="overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {/* Investment Thesis Section */}
                    <div className="mb-5 pb-5 border-b border-gray-100 dark:border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Investment Thesis
                        </span>
                        <p className="text-sm italic text-gray-800 dark:text-gray-200 leading-relaxed pl-3 border-l-2 border-[#0055c8]">
                            "{product.thesis}"
                        </p>
                    </div>

                    {/* AI Summary Section */}
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 flex items-center gap-1">
                            <BrainCircuit className="w-3 h-3" /> Gemini Summary
                        </span>
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-11/12" />
                                <Skeleton className="h-3 w-4/6" />
                            </div>
                        ) : (
                            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                                {summary}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Description - Flex grow to push footer down */}
        <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed font-normal relative z-10 flex-grow">
            {product.desc}
        </p>
        
        {/* Footer: Sparkline & CTA */}
        <div className="mt-auto relative z-10 pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
             <span>Performance</span>
             <span className="text-[#0055c8]">AUM: {product.aum}</span>
          </div>
          <Sparkline data={product.history} color="#0055c8" />
          <div className="flex items-center justify-between mt-4">
             <span className="text-[10px] font-bold text-gray-400">Last updated: 1h ago</span>
             <button className="text-[10px] font-black uppercase text-[#0b1221] dark:text-white group-hover:text-[#0055c8] transition-colors flex items-center gap-1">
                {t.products.details} <ArrowUpRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const ProductsSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [sortBy, setSortBy] = useState<'AUM' | 'Performance' | 'Volatility'>('AUM');

  // Map translation data to products structure
  const products = t.productsData.map((item, index) => {
    const baseData = [
        {
            aumValue: 2.4, aum: '$2.4B', volValue: 75, volatilityWidth: '75%', perfValue: 12.4, statsValue: '12.4%',
            history: [100, 105, 103, 112, 108, 115, 122],
            holdings: [{ name: 'TSMC', weight: 8.2 }, { name: 'Samsung', weight: 6.5 }],
            icon: <TrendingUp />
        },
        {
            aumValue: 1.8, aum: '$1.8B', volValue: 40, volatilityWidth: '40%', perfValue: 8.2, statsValue: '8.2%',
            history: [100, 101, 102, 102.5, 103],
            holdings: [{ name: 'Indonesia Treasury', weight: 7.8 }],
            icon: <Globe />
        },
        {
            aumValue: 3.1, aum: '$3.1B', volValue: 20, volatilityWidth: '20%', perfValue: 4.5, statsValue: '4.5%',
            history: [100, 100.5, 101, 101.2, 102, 103.5, 104.5],
            holdings: [{ name: 'US T-Bills', weight: 25.0 }, { name: 'Gold', weight: 12.0 }],
            icon: <Shield />
        },
        {
            aumValue: 1.2, aum: '$1.2B', volValue: 65, volatilityWidth: '65%', perfValue: 15.6, statsValue: '15.6%',
            history: [100, 108, 104, 110, 118, 112, 125],
            holdings: [{ name: 'CP Group', weight: 5.4 }, { name: 'Sea Ltd', weight: 4.8 }],
            icon: <Zap />
        }
    ][index % 4];

    return { ...baseData, ...item };
  });

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => riskFilter === 'All' || p.riskProfile === riskFilter);
    
    result.sort((a, b) => {
      if (sortBy === 'AUM') return b.aumValue - a.aumValue;
      if (sortBy === 'Performance') return b.perfValue - a.perfValue;
      if (sortBy === 'Volatility') return b.volValue - a.volValue;
      return 0;
    });

    return result;
  }, [riskFilter, sortBy, products]);

  return (
    <section id="products" className="bg-[#f8f9fa] dark:bg-[#050505] py-24 md:py-32 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <ScrollReveal direction="up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
            <div>
              <span className="text-[#0055c8] uppercase font-black tracking-widest text-xs mb-4 block">Asset Management</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0b1221] dark:text-white uppercase font-condensed">{t.products.title}</h2>
            </div>

            {/* Controls Panel */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex bg-white dark:bg-white/5 p-1.5 rounded-xl border border-gray-200 dark:border-white/10 overflow-x-auto shadow-sm">
                {['All', 'High', 'Medium', 'Low'].map((r) => (
                  <button 
                    key={r}
                    onClick={() => setRiskFilter(r as any)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${riskFilter === r ? 'bg-[#0055c8] text-white shadow-md' : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white dark:bg-white/5 text-[10px] font-bold uppercase tracking-wider pl-5 pr-10 py-3 rounded-xl outline-none border border-gray-200 dark:border-white/10 cursor-pointer hover:border-[#0055c8] transition-colors shadow-sm text-gray-700 dark:text-white"
                >
                  <option value="AUM">Sort: AUM</option>
                  <option value="Performance">Sort: Performance</option>
                  <option value="Volatility">Sort: Volatility</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ArrowUpRight className="w-3 h-3 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-10 min-h-[600px]">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((p, idx) => (
              <ProductCard 
                key={idx} 
                product={p} 
                index={idx} 
                onClick={() => setSelectedProduct(p)} 
              />
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-32 text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
               <div className="text-6xl mb-6 opacity-20 grayscale">🔍</div>
               <p className="text-xs uppercase font-bold tracking-widest text-center px-4">No investment vehicles found matching criteria.</p>
               <Button variant="ghost" className="mt-6 tracking-widest" onClick={() => setRiskFilter('All')}>Clear Filters</Button>
            </div>
          )}
        </div>

        <ScrollReveal direction="up" className="mt-20 text-center">
            <Button variant="outline" size="xl" className="group tracking-widest px-12 py-5 rounded-xl border-gray-300 dark:border-white/20 hover:border-[#0055c8] dark:hover:border-[#0055c8]">
                {t.products.viewRange}
                <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
        </ScrollReveal>
      </div>
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};

export default ProductsSection;
