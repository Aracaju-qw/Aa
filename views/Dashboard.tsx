
import React from 'react';
import { NavSection, Sermon } from '../types';
import { Plus, Clock, Book, Star, Trash2, ChevronRight, Edit2, Sparkles, Zap, Calendar as CalendarIcon } from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: NavSection) => void;
  sermons: Sermon[];
  onDelete: (id: string) => void;
  onEdit: (sermon: Sermon) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, sermons, onDelete, onEdit }) => {
  const recentSermons = sermons.slice(0, 4);

  const getServiceOfTheDay = () => {
    const today = new Date().getDay(); 
    
    const schedule = [
      { day: 0, name: 'Celebrando em Família', desc: 'Culto de Adoração e Família', color: 'emerald' },
      { day: 1, name: 'Círculo de Oração', desc: 'Intercessão e Clamor', color: 'indigo' },
      { day: 3, name: 'Culto de Doutrina', desc: 'Ensino Exegético', color: 'blue' },
      { day: 5, name: 'Sexta Profética', desc: 'Ministração e Poder', color: 'amber' }
    ];

    const upcomingService = schedule.find(s => s.day >= today) || schedule[0];

    return {
      name: upcomingService.name,
      desc: upcomingService.desc,
      isToday: upcomingService.day === today,
      label: upcomingService.day === today ? 'Culto de Hoje' : 'Próximo Culto',
      color: upcomingService.color
    };
  };

  const service = getServiceOfTheDay();

  const themeStyles: Record<string, string> = {
    emerald: 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 icon-bg-emerald-500/20',
    indigo: 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 icon-bg-indigo-500/20',
    blue: 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 icon-bg-blue-500/20',
    amber: 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 icon-bg-amber-500/20'
  };

  const currentStyle = themeStyles[service.color] || themeStyles.emerald;

  const getThemeBg = (theme: string) => {
    switch (theme) {
      case 'Ofertório': return 'bg-rose-500';
      case 'Doutrina': return 'bg-blue-500';
      case 'Sexta Profética': return 'bg-amber-500';
      case 'Celebrando em Família': return 'bg-emerald-500';
      case 'Círculo de Oração': return 'bg-indigo-500';
      case 'Geral': return 'bg-sky-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <button onClick={() => onNavigate(NavSection.Generator)} className="group relative bg-emerald-600 p-10 rounded-[3rem] text-white overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl shadow-emerald-600/30 text-left border border-white/10">
          <div className="absolute -top-10 -right-10 p-10 opacity-10 group-hover:scale-150 transition-transform"><Zap size={200} strokeWidth={3} /></div>
          <div className="relative z-10">
            <div className="bg-white/20 p-4 rounded-2xl w-fit mb-8 backdrop-blur-md"><Sparkles size={24} /></div>
            <h3 className="text-3xl font-black mb-1 tracking-tighter uppercase leading-none">Novo<br/>Sermão</h3>
            <p className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-2">Criar Agora <ChevronRight size={14} /></p>
          </div>
        </button>
        
        <div className={`p-10 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group shadow-sm backdrop-blur-sm ${currentStyle.split(' ').slice(0, 4).join(' ')}`}>
           <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-all duration-700 bg-${service.color}-500`}></div>
           <div className={`p-4 rounded-2xl w-fit mb-8 transition-all duration-500 bg-${service.color}-500/20 text-${service.color}-600 dark:text-${service.color}-400 group-hover:scale-110`}>
              <CalendarIcon size={24} />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{service.label}</p>
           <h3 className={`text-2xl font-black uppercase leading-tight transition-colors duration-500 ${currentStyle.split(' ')[4]}`}>
              {service.name}
           </h3>
           <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2">{service.desc}</p>
        </div>

        {[
          { icon: <Book size={24} />, title: 'Total Acervo', value: sermons.length.toString(), color: 'blue' },
          { icon: <Star size={24} />, title: 'Uso de IA', value: '100%', color: 'amber' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0A0A0A] p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm transition-all hover:-translate-y-2">
            <div className={`p-4 bg-${stat.color}-500/10 text-${stat.color}-500 rounded-2xl w-fit mb-8`}>{stat.icon}</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.title}</p>
            <h3 className="text-3xl font-black uppercase dark:text-white leading-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-[4rem] border border-slate-100 dark:border-white/5 p-12 shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-black tracking-tighter uppercase dark:text-white flex items-center gap-4"><span className="w-2 h-7 bg-emerald-600 rounded-full"></span> Recentes</h3>
            <button onClick={() => onNavigate(NavSection.Gallery)} className="px-6 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-emerald-600 hover:text-white">Ver Tudo</button>
          </div>
          <div className="space-y-4">
            {recentSermons.length > 0 ? recentSermons.map((sermon) => (
              <div key={sermon.id} onClick={() => onNavigate(NavSection.Gallery)} className="group flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/5 transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/10 cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${getThemeBg(sermon.theme)}`}><Zap size={20} /></div>
                  <div>
                    <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">{sermon.title}</h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sermon.theme} • {sermon.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 transition-all">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(sermon); }} className="p-3 text-slate-400 hover:text-emerald-500 transition-colors"><Edit2 size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(sermon.id); }} className="p-3 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-widest">Nenhum esboço recente</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-emerald-600 p-12 rounded-[4rem] text-white shadow-2xl shadow-emerald-600/30 flex flex-col justify-between border border-white/10 relative overflow-hidden h-full">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={160} /></div>
           <p className="text-2xl font-serif italic leading-relaxed text-white/90 relative z-10">"A pregação eficaz é a verdade divina canalizada através de uma alma apaixonada."</p>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 relative z-10 mt-10">Ministério Pregador Paulo</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
