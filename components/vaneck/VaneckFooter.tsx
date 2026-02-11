
import * as React from "react";
import { useLanguage } from "../../LanguageContext";
import { Icons } from "../../constants";
import { Mail, MessageSquare } from "lucide-react";

export const VaneckFooter: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/5 pt-20 pb-10 transition-colors">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <span className="text-xl font-black italic tracking-tighter uppercase text-black dark:text-white">
              UPBOT<span className="text-[#00a2bd]">RADING</span>
            </span>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {t.footer.mission}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-400 hover:border-[#00a2bd] hover:text-[#00a2bd] transition-all">
                <Icons.Linkedin />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-400 hover:border-[#00a2bd] hover:text-[#00a2bd] transition-all">
                <Icons.Youtube />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-black dark:text-white">Dịch vụ</h4>
            <ul className="space-y-4 text-xs text-gray-500">
              <li><a href="#san-pham" className="hover:text-[#00a2bd] transition-colors">Quản lý quỹ</a></li>
              <li><a href="#giao-dich" className="hover:text-[#00a2bd] transition-colors">Giao dịch chứng khoán</a></li>
              <li><a href="#" className="hover:text-[#00a2bd] transition-colors">Dịch vụ giám sát</a></li>
              <li><a href="#" className="hover:text-[#00a2bd] transition-colors">Tư vấn đầu tư</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-black dark:text-white">Thông tin</h4>
            <ul className="space-y-4 text-xs text-gray-500">
              <li><a href="#about" className="hover:text-[#00a2bd] transition-colors">Về chúng tôi</a></li>
              <li><a href="#insights" className="hover:text-[#00a2bd] transition-colors">Báo cáo phân tích</a></li>
              <li><a href="#" className="hover:text-[#00a2bd] transition-colors">Tin tức thị trường</a></li>
              <li><a href="#" className="hover:text-[#00a2bd] transition-colors">Hệ thống phí</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-black dark:text-white">Liên hệ</h4>
            <ul className="space-y-4 text-xs text-gray-500 mb-6">
              <li className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-[#00a2bd]" />
                support@upbotrading.com
              </li>
              <li className="flex items-center gap-2">
                <Icons.Globe />
                Hotline: 1900 8888
              </li>
              <li className="text-[10px] leading-relaxed">
                Tầng 25, Bitexco Financial Tower, Quận 1, TP.HCM
              </li>
            </ul>
            
            <a 
              href="mailto:support@upbotrading.com?subject=Support Request"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#00a2bd] hover:bg-[#008fa7] text-white text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-sm transition-all shadow-md active:scale-[0.98]"
            >
              <MessageSquare className="w-3 h-3" />
              Gửi yêu cầu hỗ trợ
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex gap-6">
            <a href="#" className="hover:text-black dark:hover:text-white">Điều khoản</a>
            <a href="#" className="hover:text-black dark:hover:text-white">Bảo mật</a>
            <a href="#" className="hover:text-black dark:hover:text-white">Pháp lý</a>
          </div>
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
