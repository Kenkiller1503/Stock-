
import * as React from "react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { User, KYCStatus } from "../App";
import { useLanguage } from "../LanguageContext";
import { Users, ShieldCheck, Check, X, ArrowLeft, Search } from "lucide-react";

interface AdminViewProps {
  onBack: () => void;
  onVerifyUser: (userId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack, onVerifyUser }) => {
  const { t } = useLanguage();
  const [pendingUsers, setPendingUsers] = React.useState([
    { id: '1', name: 'Trần Thị B', email: 'investorB@gmail.com', kycStatus: 'pending' as KYCStatus, timestamp: '1h ago' },
    { id: '2', name: 'Lê Văn C', email: 'levanc@outlook.com', kycStatus: 'pending' as KYCStatus, timestamp: '4h ago' },
    { id: '3', name: 'Hoàng Minh D', email: 'dminh@company.com', kycStatus: 'pending' as KYCStatus, timestamp: '1d ago' },
  ]);

  const handleApprove = (id: string) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== id));
    onVerifyUser(id);
  };

  return (
    <div className="container mx-auto px-6 py-12 animate-fadeIn space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-gray-500 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-condensed uppercase tracking-tighter">{t.admin.title}</h1>
            <p className="text-gray-500">{t.admin.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-sm px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder={t.admin.searchPlaceholder} className="bg-transparent text-sm focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border bg-white dark:bg-[#0a0a0a] p-6 shadow-lg">
          <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{t.admin.pendingKyc}</div>
          <div className="text-3xl font-bold text-[#e76408]">{pendingUsers.length}</div>
        </Card>
        <Card className="border bg-white dark:bg-[#0a0a0a] p-6 shadow-lg">
          <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{t.admin.totalInvestors}</div>
          <div className="text-3xl font-bold">1,402</div>
        </Card>
        <Card className="border bg-white dark:bg-[#0a0a0a] p-6 shadow-lg">
          <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{t.admin.aum}</div>
          <div className="text-3xl font-bold text-[#00a2bd]">$2.4B</div>
        </Card>
        <Card className="border bg-white dark:bg-[#0a0a0a] p-6 shadow-lg">
          <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{t.admin.systemStatus}</div>
          <Badge className="bg-green-500/10 text-green-500 border-green-500/10">{t.admin.normal}</Badge>
        </Card>
      </div>

      <Card className="border bg-white dark:bg-[#0a0a0a] p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#e76408]" />
          {t.admin.kycTableTitle}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase text-gray-500 border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="py-3">{t.admin.table.name}</th>
                <th className="py-3">{t.admin.table.email}</th>
                <th className="py-3">{t.admin.table.time}</th>
                <th className="py-3">{t.admin.table.status}</th>
                <th className="py-3 text-right">{t.admin.table.action}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 italic">{t.admin.emptyState}</td>
                </tr>
              ) : pendingUsers.map((u) => (
                <tr key={u.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 font-bold">{u.name}</td>
                  <td className="py-4 text-gray-500">{u.email}</td>
                  <td className="py-4 text-gray-400">{u.timestamp}</td>
                  <td className="py-4">
                    <Badge className="bg-[#e76408]/10 text-[#e76408] border-[#e76408]/10 font-bold">PENDING</Badge>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button 
                        onClick={() => handleApprove(u.id)}
                        className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-sm transition-all"
                        title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all" title="Reject">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
