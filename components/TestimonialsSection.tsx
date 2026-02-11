import React from 'react';
import { useLanguage } from '../LanguageContext';
import ScrollReveal from './ScrollReveal';

const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gray-50 dark:bg-[#0a0a0a] py-24 overflow-hidden border-y border-black/5 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-normal text-black dark:text-white mb-4">{t.testimonials.title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t.testimonials.subtitle}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonials.items.map((item, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 150} className="h-full">
              <div className="bg-white dark:bg-[#111] p-10 h-full flex flex-col border border-black/5 dark:border-white/5 rounded-sm hover:shadow-2xl transition-all">
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-light italic mb-10 flex-grow">"{item.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} className="w-12 h-12 rounded-full grayscale" alt={item.author} />
                  <div>
                    <h4 className="text-black dark:text-white font-bold text-sm uppercase tracking-widest">{item.author}</h4>
                    <span className="text-[10px] text-[#00a2bd] font-bold uppercase">{item.role}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;