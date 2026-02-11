
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { getInsightSummary } from '../services/geminiService';
import { useLanguage } from '../LanguageContext';
import ScrollReveal from './ScrollReveal';
import { Skeleton } from './ui/Skeleton';

const OPPORTUNITIES = [
  { id: 'emerging', label: 'Thị trường Mới nổi', expert: 'Diliana Deltcheva', role: 'Trưởng bộ phận Nợ Thị trường Mới nổi', title: 'Sự kiên cường của Nợ Thị trường Mới nổi' },
  { id: 'quant', label: 'Định lượng Chủ động', expert: 'Jeroen Hagens', role: 'Quản lý Danh mục Khách hàng', title: 'Hiện đại hóa Cổ phiếu Định lượng' },
  { id: 'credit', label: 'Đầu tư Tín dụng', expert: 'Joop Kohler', role: 'Trưởng nhóm Tín dụng', title: 'Mở khóa Giá trị Tiềm ẩn trong Tín dụng' },
  { id: 'value', label: 'Đầu tư Giá trị', expert: 'Steven L. Pollack', role: 'Quản lý Danh mục, Boston Partners', title: 'Sự phục hồi của Giá trị Vốn hóa Trung bình' }
];

const OpportunitiesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(OPPORTUNITIES[0].id);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const { lang, t } = useLanguage();

  const activeOpp = OPPORTUNITIES.find(o => o.id === activeTab)!;

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingAi(true);
      const summary = await getInsightSummary(activeOpp.title, lang);
      setAiSummary(summary);
      setLoadingAi(false);
    };
    fetchSummary();
  }, [activeOpp.title, lang]);

  return (
    <div className="bg-white dark:bg-[#101010] py-24 relative overflow-hidden text-black dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <ScrollReveal direction="up" distance={30} duration={1200}>
          <h2 className="text-4xl md:text-5xl font-normal mb-4">{t.opportunities.title}</h2>
          <p className="text-gray-500 dark:text-white/60 max-w-xl mb-12">{t.opportunities.subtitle}</p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="flex flex-col gap-2">
            {OPPORTUNITIES.map((opp, idx) => (
              <ScrollReveal 
                key={opp.id} 
                direction="right" 
                delay={200 + (idx * 100)} 
                distance={20}
              >
                <button
                  onClick={() => setActiveTab(opp.id)}
                  className={`w-full text-left p-6 border-t border-black/5 dark:border-white/10 transition-all duration-500 ${
                    activeTab === opp.id 
                      ? 'bg-black/5 dark:bg-white/10 border-l-2 border-l-[#00a2bd] text-black dark:text-white' 
                      : 'text-gray-400 dark:text-white/40 hover:text-black dark:hover:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-l-transparent'
                  }`}
                >
                  <span className="text-[10px] uppercase font-black tracking-[0.2em]">{opp.label}</span>
                </button>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={500} distance={50} duration={1200} className="w-full">
            <div className="bg-[#f9f9f9] dark:bg-[#1c1c1c] border border-black/5 dark:border-white/10 p-8 md:p-12 min-h-[480px] flex flex-col relative rounded-sm shadow-2xl transition-colors duration-500">
              
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
                <ScrollReveal direction="up" scale={0.8} delay={700} distance={20} duration={1000}>
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-[#101010] flex items-center justify-center text-[#00a2bd] text-4xl font-bold border border-black/5 dark:border-white/10 shadow-inner group transition-transform duration-700 hover:rotate-12">
                    <span className="relative z-10">{activeOpp.expert[0]}</span>
                    <div className="absolute inset-0 rounded-full bg-[#00a2bd]/5 animate-ping opacity-20" />
                  </div>
                </ScrollReveal>
                
                <ScrollReveal direction="up" delay={800} distance={15}>
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-black dark:text-white">{activeOpp.expert}</h3>
                    <p className="text-[#00a2bd] text-xs uppercase font-black tracking-widest">{activeOpp.role}</p>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal direction="up" delay={900} distance={30} duration={1200}>
                <blockquote className="text-2xl md:text-4xl font-light italic leading-snug mb-12 relative px-4 text-black dark:text-white">
                  <span className="text-[#e76408] text-8xl absolute -top-8 -left-6 opacity-20 font-serif pointer-events-none select-none">“</span>
                  {activeOpp.title}
                </blockquote>
              </ScrollReveal>

              <div className="mt-auto pt-8 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1 w-full">
                  <ScrollReveal direction="up" delay={1100} distance={10}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00a2bd] shadow-[0_0_10px_rgba(0,162,189,0.8)] animate-pulse" />
                      <span className="text-[10px] uppercase font-black text-gray-400 dark:text-white/40 tracking-[0.2em]">{t.opportunities.aiView}</span>
                    </div>
                  </ScrollReveal>
                  
                  <div className="min-h-[4em]">
                    {loadingAi ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed italic font-light animate-fadeIn">
                        {aiSummary}
                      </p>
                    )}
                  </div>
                </div>
                
                <ScrollReveal direction="left" delay={1300} distance={20}>
                  <button className="flex items-center gap-3 text-[#00a2bd] font-black uppercase text-[10px] tracking-[0.2em] hover:translate-x-2 transition-transform whitespace-nowrap py-3 px-6 border border-[#00a2bd]/20 rounded-sm hover:bg-[#00a2bd]/5">
                    {t.opportunities.viewBtn} <Icons.ArrowRight />
                  </button>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#00a2bd]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-[#e76408]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{animationDelay: '1s'}} />
    </div>
  );
};

export default OpportunitiesSection;
