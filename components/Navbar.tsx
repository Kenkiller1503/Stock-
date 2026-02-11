
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Icons, NAV_LINKS, COLORS } from '../constants';
import { useLanguage, Language } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { performGlobalSearch } from '../services/geminiService';
import { Skeleton } from './ui/Skeleton';
import { Badge } from './ui/Badge';
import { Settings, Palette, Type as TypeIcon, X, Clock, Zap, TrendingUp, Check, SlidersHorizontal, Trash2, ArrowUpRight, ChevronDown, Loader2, Sparkles, Monitor, Moon, Sun, Layout, Type, ExternalLink } from 'lucide-react';
import { User, ViewState } from '../App';

interface SearchResult {
  title: string;
  category: string;
  link: string;
  snippet?: string;
  featured?: boolean;
}

const TRENDING_TOPICS = {
  vn: ['UPBOTRADING', 'VN30', 'Phái sinh', 'Lãi suất'],
  en: ['UPBOTRADING', 'VN30', 'Derivatives', 'Interest Rates'],
  zh: ['UPBOTRADING', 'VN30', '衍生品', '利率']
};

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiResults, setAiResults] = useState<SearchResult[]>([]);
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  // Debounce ref
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const langRef = useRef<HTMLDivElement>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Search Input Change with Debounce
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (searchQuery.trim().length > 2) {
        setIsSearchingAI(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const { results } = await performGlobalSearch(searchQuery, lang);
                setAiResults(results);
            } catch (e) {
                setAiResults([]);
            } finally {
                setIsSearchingAI(false);
            }
        }, 800);
    } else {
        setAiResults([]);
        setIsSearchingAI(false);
    }
  }, [searchQuery, lang]);

  const handleResultClick = useCallback((link: any) => {
    if (!link || typeof link !== 'string' || link.trim() === '') return;
    setSearchOpen(false);
    setSearchQuery('');
    if (link.startsWith('#')) {
      const sectionId = link.replace('#', '');
      onNavigate(sectionId as any);
    } else {
      window.open(link, '_blank');
    }
  }, [onNavigate]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled || currentView !== 'marketing' ? "bg-white/90 dark:bg-[#0b1221]/90 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/10" : "bg-transparent"
        } h-16`}
      >
        <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <button onClick={() => onNavigate('marketing')} className="flex items-center gap-2 group">
              <div className="flex items-center">
                 <span className="text-2xl font-black italic tracking-tighter uppercase text-[#0b1221] dark:text-white">
                    UPBOT<span className="text-[#00a2bd]">RADING</span>
                 </span>
                 <span className="ml-2 text-[10px] text-gray-500 font-semibold tracking-wide border-l border-gray-300 pl-2 hidden sm:block">by UPBO</span>
              </div>
            </button>
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className={`text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#0055c8] dark:hover:text-[#0055c8] transition-colors`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSearchOpen(true)} 
              className="p-2 text-gray-500 hover:text-[#0055c8] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <Icons.Search />
            </button>
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-500 hover:text-[#0055c8] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)} 
                className="flex items-center gap-1 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#0055c8] transition-colors px-2"
              >
                {lang === 'vn' ? 'VN' : lang === 'en' ? 'EN' : 'ZH'}
                <ChevronDown className="w-3 h-3" />
              </button>
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#1e293b] shadow-xl rounded-md py-1 z-[200] border border-gray-100 dark:border-gray-700">
                  {(['vn', 'en', 'zh'] as Language[]).map((l) => (
                    <button 
                        key={l} 
                        onClick={() => { setLang(l); setLangDropdownOpen(false); }} 
                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 ${lang === l ? 'text-[#0055c8]' : 'text-gray-600 dark:text-gray-300'}`}
                    >
                      {l === 'vn' ? 'Tiếng Việt' : l === 'en' ? 'English' : '中文'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                 <button onClick={() => onNavigate('dashboard')} className="text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#0055c8] transition-colors hidden sm:block">
                   {user.name}
                 </button>
                 <button 
                  onClick={onLogout} 
                  className="bg-[#f0f2f5] dark:bg-white/10 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <span className="hidden sm:inline">{lang === 'vn' ? 'Đăng xuất' : 'Logout'}</span>
                  <span className="sm:hidden"><X className="w-4 h-4"/></span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate('auth')} 
                    className="text-gray-600 dark:text-gray-300 px-3 py-2 text-sm font-bold hover:text-[#0055c8] transition-colors hidden sm:block"
                  >
                    {t.nav.login}
                  </button>
                  <button 
                    onClick={() => onNavigate('auth')} 
                    className="bg-[#0055c8] text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-[#0044a0] transition-all shadow-md shadow-blue-500/20"
                  >
                    Mở tài khoản
                  </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <div className={`fixed inset-0 z-[300] bg-white/95 dark:bg-[#0b1221]/95 backdrop-blur-xl transition-all duration-300 ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="max-w-3xl mx-auto pt-32 px-6">
            <div className="flex justify-end mb-8">
                <button onClick={() => setSearchOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <X className="w-8 h-8 text-gray-500" />
                </button>
            </div>
            
            <div className="relative">
                <input 
                    type="text" 
                    placeholder={t.nav.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-4 focus:outline-none focus:border-[#0055c8] transition-colors text-[#0b1221] dark:text-white placeholder-gray-300"
                    autoFocus={searchOpen}
                />
                {isSearchingAI && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#0055c8] flex items-center gap-2 animate-pulse">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-widest">Gemini Searching...</span>
                    </div>
                )}
            </div>

            <div className="mt-12 overflow-y-auto max-h-[60vh]">
                {aiResults.length > 0 ? (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-[#00a2bd]" /> AI Results (Google Grounding)
                        </h3>
                        {aiResults.map((result, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleResultClick(result.link)}
                                className="group p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-bold text-[#0b1221] dark:text-white group-hover:text-[#0055c8] transition-colors">
                                        {result.title}
                                    </h4>
                                    <Badge className="bg-gray-100 dark:bg-white/10 text-gray-500 border-0">{result.category}</Badge>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{result.snippet}</p>
                                {result.link && !result.link.startsWith('#') && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-[#0055c8]">
                                        <ExternalLink className="w-3 h-3" /> {result.link}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : !searchQuery && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t.nav.strategicTrending}</h3>
                        <div className="flex flex-wrap gap-3">
                            {TRENDING_TOPICS[lang].map(topic => (
                                <button key={topic} onClick={() => setSearchQuery(topic)} className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-sm font-medium hover:bg-[#0055c8] hover:text-white transition-all text-gray-600 dark:text-gray-300">
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
