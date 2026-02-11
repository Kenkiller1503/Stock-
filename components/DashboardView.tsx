
import * as React from "react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { User, Position, Transaction } from "../App";
import { useLanguage } from "../LanguageContext";
import { 
  Wallet, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  CreditCard,
  Layers,
  Zap,
  ListTodo,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { TaskModal } from "./TaskModal";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

interface DashboardViewProps {
  user: User;
  cashBalance: number;
  positions: Position[];
  transactions: Transaction[];
  marketPrices: Record<string, number>;
  onStartKYC: () => void;
  onGoAdmin: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  user, 
  cashBalance, 
  positions, 
  transactions, 
  marketPrices,
  onStartKYC, 
  onGoAdmin 
}) => {
  const { t } = useLanguage();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

  React.useEffect(() => {
    const savedTasks = localStorage.getItem(`upbot_tasks_${user.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const defaults: Task[] = [
        { id: '1', title: 'Hoàn thành hồ sơ eKYC', description: 'Tải lên CMND/CCCD và quét khuôn mặt.', completed: user.kycStatus === 'verified', createdAt: Date.now() },
        { id: '2', title: 'Phân tích VN30', description: 'Đánh giá tỷ trọng các mã lớn trong rổ VN30.', completed: false, createdAt: Date.now() },
      ];
      setTasks(defaults);
    }
  }, [user.id, user.kycStatus]);

  React.useEffect(() => {
    localStorage.setItem(`upbot_tasks_${user.id}`, JSON.stringify(tasks));
  }, [tasks, user.id]);

  // Portfolio Valuation
  const currentInvestedValue = positions.reduce((sum, pos) => {
    const currentPrice = marketPrices[pos.symbol] || pos.entry;
    return sum + (currentPrice * pos.qty);
  }, 0);
  
  const totalCost = positions.reduce((sum, pos) => sum + (pos.entry * pos.qty), 0);
  const totalProfit = currentInvestedValue - totalCost;
  const totalPortfolioValue = cashBalance + currentInvestedValue;
  const investmentRatio = totalPortfolioValue > 0 ? (currentInvestedValue / totalPortfolioValue) * 100 : 0;

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      completed: false,
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="container mx-auto px-6 py-12 animate-fadeIn space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.dashboard.marketActive}</span>
          </div>
          <h1 className="text-4xl font-condensed uppercase tracking-tighter">{t.dashboard.greeting}, {user.name}</h1>
          <p className="text-gray-500">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex gap-3">
          {user.role === 'admin' && (
            <Button variant="soft" onClick={onGoAdmin} className="gap-2">
              <Zap className="w-4 h-4" /> {t.dashboard.admin}
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" /> {t.dashboard.settings}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <Card className="border bg-white dark:bg-[#0a0a0a] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00a2bd]/10 rounded-full flex items-center justify-center text-[#00a2bd]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.dashboard.nav}</h3>
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalProfit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {totalProfit >= 0 ? '+' : ''}{new Intl.NumberFormat().format(totalProfit)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-mono font-bold tracking-tighter">
              {new Intl.NumberFormat().format(totalPortfolioValue)} <span className="text-xs">VND</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">{t.dashboard.cash}</span>
              <span className="font-mono font-bold">{new Intl.NumberFormat().format(cashBalance)}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">{t.dashboard.invested}</span>
              <span className="font-mono font-bold">{new Intl.NumberFormat().format(currentInvestedValue)}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#e76408]" style={{ width: `${100 - investmentRatio}%` }} />
              <div className="h-full bg-[#00a2bd] transition-all duration-1000" style={{ width: `${investmentRatio}%` }} />
            </div>
          </div>
        </Card>

        {/* KYC Status Card */}
        <Card className="border bg-white dark:bg-[#0a0a0a] p-6 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 bg-[#e76408]/10 rounded-full flex items-center justify-center text-[#e76408]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.dashboard.kyc}</h3>
          </div>
          <div className="flex items-center gap-3 mb-2">
            {user.kycStatus === 'none' && <><AlertCircle className="w-6 h-6 text-red-500" /><span className="text-xl font-bold text-red-500">{t.dashboard.kycStatus.none}</span></>}
            {user.kycStatus === 'pending' && <><Clock className="w-6 h-6 text-[#e76408]" /><span className="text-xl font-bold text-[#e76408]">{t.dashboard.kycStatus.pending}</span></>}
            {user.kycStatus === 'verified' && <><CheckCircle className="w-6 h-6 text-green-500" /><span className="text-xl font-bold text-green-500">{t.dashboard.kycStatus.verified}</span></>}
          </div>
          <p className="text-xs text-gray-500 mb-auto leading-relaxed">{t.dashboard.upgrade}</p>
          <div className="mt-6">
            {user.kycStatus === 'none' && <Button variant="primary" className="w-full text-[10px]" onClick={onStartKYC}>{t.dashboard.startKyc}</Button>}
          </div>
        </Card>

        {/* Positions Summary Card */}
        <Card className="border bg-white dark:bg-[#0a0a0a] p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.dashboard.positions}</h3>
            </div>
            <div className="space-y-3">
              {positions.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">{t.dashboard.noPositions}</p>
              ) : positions.slice(0, 3).map(pos => (
                <div key={pos.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-sm">
                  <span className="text-xs font-bold uppercase">{pos.symbol}</span>
                  <span className="text-xs font-mono">{new Intl.NumberFormat().format(pos.qty)} cp</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <Button variant="ghost" size="sm" className="w-full text-[9px] font-black uppercase tracking-widest">{t.dashboard.viewAll}</Button>
          </div>
        </Card>
      </div>

      <Card className="border bg-white dark:bg-[#0a0a0a] p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00a2bd]/10 rounded-full flex items-center justify-center text-[#00a2bd]">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase font-condensed tracking-tight">{t.dashboard.roadmap}</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.dashboard.roadmapSubtitle}</p>
            </div>
          </div>
          <Button variant="primary" size="sm" className="gap-2 shadow-lg" onClick={() => setIsTaskModalOpen(true)}>
            <Plus className="w-4 h-4" /> {t.dashboard.newAction}
          </Button>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className={`flex items-start gap-4 p-5 border border-black/5 dark:border-white/5 rounded-sm transition-all group ${task.completed ? 'opacity-50' : ''}`}>
              <button onClick={() => toggleTask(task.id)} className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 dark:border-white/10'}`}>
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <h4 className={`text-sm font-bold uppercase tracking-tight ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border bg-white dark:bg-[#0a0a0a] p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold flex items-center gap-2 uppercase font-condensed tracking-tight">
            <Clock className="w-5 h-5 text-[#00a2bd]" /> {t.dashboard.history}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase text-gray-500 border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="py-4">{t.dashboard.table.time}</th>
                <th className="py-4">{t.dashboard.table.symbol}</th>
                <th className="py-4">{t.dashboard.table.order}</th>
                <th className="py-4">{t.dashboard.table.value}</th>
                <th className="py-4 text-right">{t.dashboard.table.status}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-gray-400 italic">No transactions found.</td></tr>
              ) : transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-5 text-gray-400 font-mono text-xs">{tx.date}</td>
                  <td className="py-5 font-bold uppercase">{tx.symbol}</td>
                  <td className="py-5"><span className={`${tx.type === 'MUA' ? 'text-green-500' : 'text-red-500'} font-black text-[10px] tracking-widest uppercase`}>{tx.type}</span></td>
                  <td className="py-5 font-mono font-bold">{new Intl.NumberFormat().format(tx.value)}</td>
                  <td className="py-5 text-right"><Badge className="bg-green-500/10 text-green-500 border-green-500/10">{tx.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onAdd={addTask} />
    </div>
  );
};
