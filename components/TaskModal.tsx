
import * as React from "react";
import { X, Plus, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Reset form when opening
      setTitle("");
      setDescription("");
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="relative w-full max-w-lg bg-white dark:bg-[#080808] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-black/5 dark:border-white/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#00a2bd]" />
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plus className="w-4 h-4 text-[#00a2bd]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Action Item Registry</span>
            </div>
            <h2 className="text-3xl font-condensed uppercase tracking-tighter">New Strategic Task</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Task Title</label>
            <input 
              type="text" 
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Review Q1 VNM Portfolio" 
              className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 rounded-none py-4 px-4 focus:outline-none focus:border-[#00a2bd] focus:bg-white dark:focus:bg-white/[0.05] transition-all font-medium text-black dark:text-white" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Context / Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional strategic parameters..." 
              rows={3}
              className="w-full bg-gray-50 dark:bg-white/[0.03] border-0 border-b border-black/10 dark:border-white/10 rounded-none py-4 px-4 focus:outline-none focus:border-[#00a2bd] focus:bg-white dark:focus:bg-white/[0.05] transition-all font-medium resize-none text-black dark:text-white" 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1 shadow-lg">
              <span className="flex items-center gap-2">
                Commit Task
                <ChevronRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
