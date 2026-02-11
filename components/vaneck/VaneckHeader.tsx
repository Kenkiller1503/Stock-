
import * as React from "react";
import { useLanguage } from "../../LanguageContext";
import { useTheme } from "../../ThemeContext";
import { Icons, NAV_LINKS } from "../../constants";
import { ViewState, User } from "../../App";

interface VaneckHeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

export const VaneckHeader: React.FC<VaneckHeaderProps> = ({ currentView, onNavigate, user, onLogout }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled || currentView !== 'marketing' ? "bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md h-16 shadow-sm border-b border-black/5 dark:border-white/5" : "bg-transparent h-20"
    }`}>
      <div className="container mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button onClick={() => onNavigate('marketing')} className="flex items-center group">
            <span className="text-xl font-black italic tracking-tighter uppercase text-black dark:text-white">
              UPBOT<span className="text-[#00a2bd]">RADING</span>
            </span>
          </button>
          
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#00a2bd] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-[#00a2bd] transition-colors"
          >
            {theme === 'dark' ? <Icons.Globe /> : <Icons.Globe />}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'vn' : 'en')}
            className="px-3 py-1 text-[10px] font-black border border-black/10 dark:border-white/10 rounded uppercase"
          >
            {lang}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
               <button 
                onClick={() => onNavigate('dashboard')}
                className="text-[10px] font-black uppercase text-gray-500 hover:text-[#00a2bd]"
               >
                 Hi, {user.name}
               </button>
               <button 
                onClick={onLogout}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
               >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#00a2bd] hover:text-white transition-all"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
