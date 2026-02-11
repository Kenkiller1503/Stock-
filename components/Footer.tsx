
import React from 'react';
import { Icons } from '../constants';
import { useLanguage } from '../LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white dark:bg-[#0a0a0a] text-gray-500 dark:text-gray-400 pt-24 pb-12 px-6 md:px-10 border-t border-black/5 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <span className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase italic">
              UPBOT<span className="text-[#00a2bd]">RADING</span>
            </span>
            <p className="text-sm leading-relaxed max-w-xs">{t.footer.mission}</p>
            <div className="flex gap-5">
              <a href="#" className="text-black dark:text-white hover:text-[#00a2bd] transition-colors" aria-label="LinkedIn">
                <Icons.Linkedin />
              </a>
              <a href="#" className="text-black dark:text-white hover:text-[#00a2bd] transition-colors" aria-label="YouTube">
                <Icons.Youtube />
              </a>
              <a href="#" className="text-black dark:text-white hover:text-[#00a2bd] transition-colors" aria-label="Instagram">
                <Icons.Instagram />
              </a>
              <a href="#" className="text-black dark:text-white hover:text-[#00a2bd] transition-colors" aria-label="Facebook">
                <Icons.Facebook />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-black dark:text-white uppercase text-xs font-bold tracking-widest mb-6">{t.footer.keyTopics}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#insights" className="hover:text-[#00a2bd] transition-colors">{t.nav.insights}</a></li>
              <li><a href="#products" className="hover:text-[#00a2bd] transition-colors">{t.nav.products}</a></li>
              <li><a href="#solutions" className="hover:text-[#00a2bd] transition-colors">{t.nav.solutions}</a></li>
              <li><a href="#sustainable" className="hover:text-[#00a2bd] transition-colors">{t.nav.sustainable}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-black dark:text-white uppercase text-xs font-bold tracking-widest mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#about" className="hover:text-[#00a2bd] transition-colors">{t.nav.about}</a></li>
              <li><a href="#" className="hover:text-[#00a2bd] transition-colors">{t.footer.quick.contact}</a></li>
              <li><a href="#" className="hover:text-[#00a2bd] transition-colors">{t.footer.quick.media}</a></li>
              <li><a href="#" className="hover:text-[#00a2bd] transition-colors">{t.footer.quick.careers}</a></li>
            </ul>
          </div>

          <div className="bg-gray-100 dark:bg-[#111] p-8 rounded-sm text-black dark:text-white transition-colors duration-500">
            <h4 className="font-bold text-lg mb-4">{t.footer.ctaTitle}</h4>
            <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">{t.footer.ctaDesc}</p>
            <button className="w-full bg-[#00a2bd] text-white py-3 font-bold uppercase text-xs tracking-widest hover:bg-[#007a8e] transition-colors flex items-center justify-center gap-2 group">
              {t.footer.ctaBtn} 
              <span className="group-hover:translate-x-1 transition-transform">
                <Icons.ArrowRight />
              </span>
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col lg:flex-row justify-between gap-8 text-[11px] uppercase tracking-widest font-bold">
          <div className="flex flex-wrap gap-8">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.legal.disclaimer}</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.legal.privacy}</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.legal.cookie}</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.footer.legal.security}</a>
          </div>
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
