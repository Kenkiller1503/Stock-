
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { useLanguage } from '../LanguageContext';
import { getInsightSummary, getMarketUpdate, getInsightSentiment } from '../services/geminiService';
import ScrollReveal from './ScrollReveal';
import { Skeleton } from './ui/Skeleton';
import { Badge } from './ui/Badge';
import { BrainCircuit } from 'lucide-react';

const InsightsSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const [marketUpdate, setMarketUpdate] = useState<{content: string | null, sources: any[]} | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [sentiments, setSentiments] = useState<Record<string, string>>({});
  const [loadingSentiments, setLoadingSentiments] = useState<Record<string, boolean>>({});

  const insightsData = t.insightsData.map((item, index) => ({
    ...item,
    imageUrl: [
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=600&auto=format&fit=crop'
    ][index % 4]
  }));

  useEffect(() => {
    const fetchMarketNews = async () => {
      setLoadingUpdate(true);
      const data = await getMarketUpdate(lang);
      setMarketUpdate(data);
      setLoadingUpdate(false);
    };
    fetchMarketNews();

    // Fetch sentiments for all insights
    insightsData.forEach(async (insight) => {
      setLoadingSentiments(prev => ({ ...prev, [insight.id]: true }));
      try {
        const sentiment = await getInsightSentiment(insight.title, lang);
        setSentiments(prev => ({ ...prev, [insight.id]: sentiment }));
      } catch (err) {
        setSentiments(prev => ({ ...prev, [insight.id]: "Neutral" }));
      } finally {
        setLoadingSentiments(prev => ({ ...prev, [insight.id]: false }));
      }
    });
  }, [lang]);

  const getSentimentBadge = (id: string) => {
    const sentiment = sentiments[id];
    if (loadingSentiments[id]) return <Skeleton className="h-4 w-12 rounded-sm inline-block" />;
    if (!sentiment || typeof sentiment !== 'string') return null;

    let colorClass = "border-gray-500/30 text-gray-500 bg-gray-500/5";
    if (sentiment.includes("Positive")) colorClass = "border-emerald-500/50 text-emerald-500 bg-emerald-500/10";
    else if (sentiment.includes("Negative")) colorClass = "border-rose-500/50 text-rose-500 bg-rose-500/10";
    else colorClass = "border-blue-400/50 text-blue-400 bg-blue-400/10";

    return (
      <Badge className={`${colorClass} font-black text-[8px] py-0 px-1.5 ml-2 border h-4 inline-flex items-center align-middle whitespace-nowrap`}>
        {sentiment.toUpperCase()}
      </Badge>
    );
  };

  return (
    <section id="insights" className="bg-white dark:bg-[#101010] text-black dark:text-white py-24 overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <ScrollReveal direction="right">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tighter">{t.insights.title}</h2>
          </ScrollReveal>
          <ScrollReveal direction="left">
            <button className="border border-[#e76408] text-[#e76408] px-8 py-4 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-[#e76408] hover:text-white transition-all">{t.insights.moreBtn}</button>
          </ScrollReveal>
        </div>

        {/* Live Market Intelligence Section */}
        <ScrollReveal direction="up" distance={20} className="mb-16">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] p-8 rounded-sm border-l-4 border-[#00a2bd] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <BrainCircuit className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-[#00a2bd]/10 rounded-full text-[#00a2bd]">
                <Icons.Globe />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest">
                  {lang === 'vn' ? 'Cập nhật Thị trường (AI)' : lang === 'zh' ? '市場更新 (AI)' : 'Live Market Intelligence'}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Powered by Gemini 3.0 • Real-time Scan</p>
              </div>
            </div>
            
            <div className="min-h-[100px] mb-6 relative z-10">
              {loadingUpdate ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : marketUpdate?.content ? (
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed font-light text-gray-700 dark:text-gray-300 whitespace-pre-line animate-fadeIn">
                  {marketUpdate.content}
                </div>
              ) : (
                <p className="italic text-gray-500 text-sm">Market data currently unavailable.</p>
              )}
            </div>

            {marketUpdate?.sources && marketUpdate.sources.length > 0 && !loadingUpdate && (
              <div className="flex flex-wrap gap-3 pt-6 border-t border-black/5 dark:border-white/5 animate-fadeIn relative z-10">
                <span className="text-[9px] font-black uppercase text-gray-400 self-center tracking-widest">{t.chatbot.sources}:</span>
                {marketUpdate.sources.map((source: any, i: number) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-[10px] font-bold text-[#00a2bd] hover:text-white hover:bg-[#00a2bd] bg-white dark:bg-black/20 px-3 py-1.5 rounded-sm border border-[#00a2bd]/20 transition-all truncate max-w-[200px]"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {insightsData.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100 dark:bg-white/5 rounded-sm shadow-sm transition-colors duration-500">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black border-0">{item.type.toUpperCase()}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#00a2bd]">{item.date}</div>
                </div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-[#00a2bd] transition-colors">
                  {item.title}
                  {getSentimentBadge(item.id)}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-t border-black/5 dark:border-white/5 pt-2">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
