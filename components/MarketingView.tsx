
import * as React from "react";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { TrendingUp, Wallet } from "lucide-react";
import TradingSection from "./TradingSection";
import Hero from "./Hero";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../LanguageContext";

interface MarketingViewProps {
  onStart: () => void;
  onPlaceOrder?: (order: { symbol: string, qty: number, price: number, side: 'Buy' | 'Sell' }) => void;
  positions?: any[];
  onUpdatePrices?: (prices: Record<string, number>) => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ onStart, onPlaceOrder, positions, onUpdatePrices }) => {
  const { t } = useLanguage();
  
  // Memoize handlers to prevent unnecessary re-renders in TradingSection
  const handlePlaceOrderMemo = React.useCallback((order: { symbol: string, qty: number, price: number, side: 'Buy' | 'Sell' }) => {
    if (onPlaceOrder) onPlaceOrder(order);
  }, [onPlaceOrder]);

  const handleUpdatePricesMemo = React.useCallback((prices: Record<string, number>) => {
    if (onUpdatePrices) onUpdatePrices(prices);
  }, [onUpdatePrices]);

  return (
    <div className="animate-fadeIn">
      {/* Cinematic Video Hero Section */}
      <Hero onStart={onStart} />

      {/* Value Proposition / Features Section */}
      <section id="solutions" className="container mx-auto px-6 py-24 md:py-40 relative z-10">
        <div className="grid gap-16 md:grid-cols-12 items-center">
          <div className="md:col-span-5">
            <ScrollReveal direction="right">
              <Badge className="bg-[#e76408]/10 text-[#e76408] border-[#e76408]/20 mb-8 tracking-widest-plus">{t.marketing.badge}</Badge>
              <h2 className="text-5xl md:text-[5.5rem] font-condensed font-normal tracking-tightest leading-[0.88] mb-10 uppercase">
                {t.marketing.title} <br/>
                <span className="text-[#00a2bd] font-light italic">{t.marketing.subtitle}</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-md font-light">
                {t.marketing.desc}
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid gap-8 md:col-span-7 md:grid-cols-2">
            {[
              { 
                title: t.marketing.equityTitle, 
                desc: t.marketing.equityDesc, 
                icon: TrendingUp,
                color: "#00a2bd"
              },
              { 
                title: t.marketing.bondTitle, 
                desc: t.marketing.bondDesc, 
                icon: Wallet,
                color: "#e76408"
              },
            ].map((f, idx) => (
              <ScrollReveal key={f.title} direction="up" delay={idx * 200}>
                <Card className="group border-0 bg-gray-50 dark:bg-[#080808] p-10 hover:shadow-2xl transition-all duration-700 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-0 bg-[#00a2bd] group-hover:h-full transition-all duration-700" />
                  <div className="flex flex-col gap-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-sm bg-black/5 dark:bg-white/5 text-gray-400 group-hover:bg-[#00a2bd] group-hover:text-white transition-all duration-500">
                      <f.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="font-bold text-2xl uppercase tracking-tight mb-3 group-hover:text-[#00a2bd] transition-colors">{f.title}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">{f.desc}</p>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Section (Chart + Order Panel) */}
      <TradingSection 
        onPlaceOrder={handlePlaceOrderMemo} 
        positions={positions} 
        onUpdatePrices={handleUpdatePricesMemo} 
      />
      
      {/* Decorative Blur Accents */}
      <div className="fixed top-1/2 left-0 w-[50vw] h-[50vh] bg-[#00a2bd]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[40vw] h-[40vh] bg-[#e76408]/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
};
