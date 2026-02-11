
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { useLanguage } from '../LanguageContext';
import ScrollReveal from './ScrollReveal';

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1.2);
      setScrollProgress(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const videoScale = 1 + Math.pow(scrollProgress, 1.2) * 0.2; 
  const videoBlur = scrollProgress * 15;
  const videoBrightness = 1 - scrollProgress * 0.7;
  const videoTranslateY = scrollProgress * 250; 
  const contentTranslateY = -(scrollProgress * 150);
  const contentOpacity = 1 - (scrollProgress * 1.5);

  const mouseX = mousePos.x;
  const mouseY = mousePos.y;

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full flex items-center overflow-hidden bg-black transition-colors duration-500"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `scale(${videoScale}) translateY(${videoTranslateY}px) translateZ(0)`,
            filter: `blur(${videoBlur}px) brightness(${videoBrightness})`,
            transition: 'transform 0.2s cubic-bezier(0.1, 0, 0.2, 1)',
            willChange: 'transform, filter'
          }}
        >
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://videos.ctfassets.net/tl4x668xzide/35A6SBadmJyrCaBjRhF0g9/326e62dfbb5956e965c900f0ff5187bc/Committed-to-performance-global-mobile.mp4" type="video/mp4" />
          </video>
        </div>

        <div 
          className="absolute inset-0 z-10 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            transform: `translate(${mouseX * -20}px, ${mouseY * -20 + scrollProgress * 180}px) translateZ(0)`,
            transition: 'transform 0.5s cubic-bezier(0.1, 0.4, 0.1, 1)',
            willChange: 'transform'
          }}
        />

        <div 
          className="absolute -top-[15%] -right-[10%] w-[80vw] h-[80vw] bg-[#00a2bd]/10 blur-[180px] rounded-full z-15 mix-blend-screen"
          style={{
            transform: `translate(${mouseX * 50}px, ${mouseY * 50 - scrollProgress * 400}px) scale(${1 + scrollProgress * 0.5}) translateZ(0)`,
            transition: 'transform 1s cubic-bezier(0.1, 0, 0.1, 1)',
            willChange: 'transform'
          }}
        />

        <div 
          className="absolute -bottom-[25%] -left-[15%] w-[60vw] h-[60vw] bg-[#e76408]/8 blur-[150px] rounded-full z-15 mix-blend-screen"
          style={{
            transform: `translate(${mouseX * -40}px, ${mouseY * -40 + scrollProgress * 150}px) scale(${1 - scrollProgress * 0.3}) translateZ(0)`,
            transition: 'transform 1.4s cubic-bezier(0.1, 0, 0.1, 1)',
            willChange: 'transform'
          }}
        />
        
        <div className="absolute inset-0 z-20 overflow-hidden" style={{ opacity: 0.05 + (1 - scrollProgress) * 0.15 }}>
          <div 
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent absolute top-0 animate-scan-hero"
            style={{
               transform: `translateY(${mouseY * 25}px)`,
               transition: 'transform 0.7s ease-out'
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-25" />
      </div>

      <div 
        className="relative z-30 w-full px-6 md:px-16 lg:px-24 pb-20 pt-20"
        style={{
          transform: `translate(${mouseX * 8}px, ${contentTranslateY + mouseY * 8}px)`,
          opacity: contentOpacity,
          transition: 'transform 0.4s ease-out, opacity 0.1s linear',
          willChange: 'transform, opacity'
        }}
      >
        <div className="flex flex-col items-start text-left max-w-5xl">
          <ScrollReveal direction="right" delay={200} distance={30}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-[#00a2bd]" />
              <span className="text-[#00a2bd] uppercase font-black tracking-[0.3em] text-xs md:text-sm block whitespace-nowrap">
                {t.hero.welcome}
              </span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={400} distance={40}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-medium leading-[0.9] mb-10 text-white tracking-tighter uppercase font-condensed">
              {t.hero.title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? 'text-[#00a2bd] italic' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={600} distance={20}>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <button 
                onClick={onStart}
                className="group relative inline-flex items-center justify-center bg-[#e76408] text-white px-10 py-5 overflow-hidden rounded-sm font-black uppercase text-xs md:text-sm tracking-[0.3em] transition-all duration-500 hover:bg-white hover:text-black shadow-[0_0_40px_rgba(231,100,8,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-4">
                  {t.hero.cta}
                  <Icons.ArrowRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </button>
              
              <a href="#about" className="text-white/60 hover:text-white uppercase font-black text-xs md:text-sm tracking-[0.3em] transition-all flex items-center gap-4 group hover:scale-105 pl-4">
                {t.nav.about}
                <div className="w-8 group-hover:w-16 h-[1px] bg-white transition-all duration-500" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div 
        onClick={scrollToContent}
        className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center gap-6 group cursor-pointer transition-opacity duration-500 hover:opacity-100 opacity-40 z-30"
      >
         <div className="text-[10px] uppercase font-black tracking-[0.5em] text-white group-hover:text-[#00a2bd] transition-colors duration-500">
          {t.hero.scroll}
         </div>
         <div className="w-[1px] h-20 bg-white/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-[#00a2bd] to-transparent animate-scroll-refined" />
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-refined {
          0% { top: -100%; height: 0; opacity: 0; }
          30% { top: 0%; height: 50%; opacity: 1; }
          60% { top: 50%; height: 50%; opacity: 1; }
          100% { top: 100%; height: 0; opacity: 0; }
        }
        @keyframes scan-hero {
          0% { top: -20%; }
          100% { top: 120%; }
        }
        .animate-scroll-refined { 
          animation: scroll-refined 2.5s infinite cubic-bezier(0.7, 0, 0.3, 1); 
        }
        .animate-scan-hero {
          animation: scan-hero 10s infinite linear;
        }
      `}} />
    </section>
  );
};

export default Hero;
