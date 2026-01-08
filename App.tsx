
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  Languages, 
  BookMarked, 
  Moon, 
  Sun,
  Menu,
  Clock,
  Calendar,
  Heart,
  Church,
  Zap,
  Users,
  StickyNote,
  MessageSquare,
  ChevronRight,
  Plus,
  Signpost,
  ShieldCheck,
  MoreVertical,
  Globe,
  Book,
  Book as BibleIcon,
  BookText,
  UserCheck,
  SearchCode
} from 'lucide-react';
import { NavSection, Theme as SermonTheme, Sermon } from './types';
import Dashboard from './views/Dashboard';
import SermonGenerator from './views/SermonGenerator';
import Gallery from './views/Gallery';
import Translator from './views/Translator';
import Dictionary from './views/Dictionary';
import ThemeGallery from './views/ThemeGallery';
import QuickNotes from './views/QuickNotes';
import PortugueseDictionary from './views/PortugueseDictionary';
import BiblicalCommentary from './views/BiblicalCommentary';
import BiblicalBiography from './views/BiblicalBiography';
import BiblicalDeepDive from './views/BiblicalDeepDive';
import ChronologicalTimeline from './views/ChronologicalTimeline';
import UniversalSearch from './views/UniversalSearch';
import BibleReader from './views/BibleReader';
import GlobalNotebook from './views/GlobalNotebook';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.Dashboard);
  const [selectedGalleryTheme, setSelectedGalleryTheme] = useState<SermonTheme>('Geral');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sermonToEdit, setSermonToEdit] = useState<Sermon | null>(null);
  const [generatorKey, setGeneratorKey] = useState(0); 
  
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    const saved = localStorage.getItem('kerygma_sermons');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  useEffect(() => { localStorage.setItem('kerygma_sermons', JSON.stringify(sermons)); }, [sermons]);
  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleDeleteSermon = (id: string) => { 
    setSermons(prev => prev.filter(s => s.id !== id)); 
  };
  
  const handleEditSermon = (sermon: Sermon) => { 
    setSermonToEdit(sermon); 
    setGeneratorKey(prev => prev + 1); 
    setActiveSection(NavSection.Generator); 
  };

  const handleSaveSermon = (newSermon: Sermon) => {
    setSermons(prev => {
      const exists = prev.find(s => s.id === newSermon.id);
      if (exists) return prev.map(s => s.id === newSermon.id ? newSermon : s);
      return [newSermon, ...prev];
    });
    setSermonToEdit(null);
    setActiveSection(NavSection.Gallery);
  };

  const themeGalleries = [
    { theme: 'Ofertório' as SermonTheme, icon: <Heart size={18} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { theme: 'Doutrina' as SermonTheme, icon: <Church size={18} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { theme: 'Sexta Profética' as SermonTheme, icon: <Zap size={18} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { theme: 'Celebrando em Família' as SermonTheme, icon: <Users size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { theme: 'Círculo de Oração' as SermonTheme, icon: <ShieldCheck size={18} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const renderContent = () => {
    const commonProps = { sermons, onDelete: handleDeleteSermon, onEdit: handleEditSermon };
    switch (activeSection) {
      case NavSection.Dashboard: return <Dashboard onNavigate={setActiveSection} {...commonProps} />;
      case NavSection.Generator: return <SermonGenerator key={generatorKey} onSave={handleSaveSermon} initialSermon={sermonToEdit} />;
      case NavSection.Gallery: return <Gallery theme="Geral" {...commonProps} />;
      case NavSection.ThemeGallery: return <ThemeGallery theme={selectedGalleryTheme} {...commonProps} />;
      case NavSection.QuickNotes: return <QuickNotes />;
      case NavSection.Translator: return <Translator />;
      case NavSection.Dictionary: return <Dictionary />;
      case NavSection.PortugueseDictionary: return <PortugueseDictionary />;
      case NavSection.BiblicalCommentary: return <BiblicalCommentary />;
      case NavSection.BiblicalBiography: return <BiblicalBiography />;
      case NavSection.BiblicalDeepDive: return <BiblicalDeepDive />;
      case NavSection.ChronologicalTimeline: return <ChronologicalTimeline />;
      case NavSection.UniversalSearch: return <UniversalSearch />;
      case NavSection.Bible: return <BibleReader />;
      default: return <Dashboard onNavigate={setActiveSection} {...commonProps} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#030303] transition-colors duration-700">
      
      {/* Botão Menu Mobile */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-8 z-[100] w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-white/20"
      >
        <Menu size={28} />
      </button>

      {/* Botão Flutuante do Caderno */}
      <div className="fixed bottom-28 right-6 z-[100]">
        <button 
          onClick={() => setIsNotebookOpen(true)}
          className="w-20 h-20 bg-emerald-600 text-white rounded-full flex flex-col items-center justify-center shadow-2xl shadow-emerald-600/30 hover:scale-110 active:scale-90 transition-all border-4 border-white/20 group"
          title="Abrir Caderno de Paulo"
        >
          <BookText size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[6px] font-black uppercase tracking-widest mt-1 text-center max-w-[60px] leading-tight">Caderno de Paulo</span>
        </button>
      </div>

      <GlobalNotebook isOpen={isNotebookOpen} onClose={() => setIsNotebookOpen(false)} />

      <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
        ${isSidebarOpen ? 'translate-x-0 w-80 p-5' : '-translate-x-full lg:translate-x-0 lg:w-28 p-4'}`}>
        
        <div className="h-full bg-white/95 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col shadow-xl overflow-hidden">
          
          <div className={`flex items-center transition-all duration-500 ${isSidebarOpen ? 'p-8 gap-4' : 'p-4 justify-center mb-6'}`}>
            <div className={`${isSidebarOpen ? 'w-8 h-8' : 'w-10 h-10'} bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/30 shrink-0 transform hover:rotate-6 transition-transform text-xs`}>P</div>
            {(isSidebarOpen) && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-700 overflow-hidden whitespace-nowrap">
                <h1 className="text-xl font-black tracking-tighter uppercase text-slate-900 dark:text-white leading-none">Paulo</h1>
                <p className="text-[10.5px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-1.5">Sermonário v2</p>
              </div>
            )}
          </div>

          <nav className="flex-1 px-2 space-y-5 overflow-y-auto no-scrollbar">
            <div className="space-y-1">
              {isSidebarOpen && <p className="text-[11.5px] font-black text-slate-400 px-4 mb-3 uppercase tracking-[0.3em]">Principal</p>}
              <SidebarItem 
                active={activeSection === NavSection.Dashboard} 
                onClick={() => setActiveSection(NavSection.Dashboard)} 
                icon={<LayoutDashboard size={18} />} 
                label="Painel" 
                isOpen={isSidebarOpen}
                colorClass="text-indigo-500"
              />
              <SidebarItem 
                active={activeSection === NavSection.Generator && !sermonToEdit} 
                onClick={() => { 
                  setSermonToEdit(null); 
                  setGeneratorKey(prev => prev + 1); 
                  setActiveSection(NavSection.Generator); 
                }} 
                icon={<Plus size={18} />} 
                label="Novo Esboço" 
                isOpen={isSidebarOpen} 
                highlight 
              />
              <SidebarItem 
                active={activeSection === NavSection.Bible} 
                onClick={() => setActiveSection(NavSection.Bible)} 
                icon={<BibleIcon size={18} />} 
                label="Bíblia Digital" 
                isOpen={isSidebarOpen}
                colorClass="text-amber-600"
              />
              <SidebarItem 
                active={activeSection === NavSection.UniversalSearch} 
                onClick={() => setActiveSection(NavSection.UniversalSearch)} 
                icon={<Globe size={18} />} 
                label="Oráculo IA" 
                isOpen={isSidebarOpen}
                colorClass="text-emerald-500"
              />
            </div>

            <div className="space-y-1">
              {isSidebarOpen && <p className="text-[11.5px] font-black text-slate-400 px-4 mb-3 uppercase tracking-[0.3em]">Biblioteca</p>}
              <SidebarItem 
                active={activeSection === NavSection.Gallery} 
                onClick={() => setActiveSection(NavSection.Gallery)} 
                icon={<Library size={18} />} 
                label="Acervo Geral" 
                isOpen={isSidebarOpen}
                colorClass="text-sky-500"
              />
              {themeGalleries.map((tg) => (
                <button
                  key={tg.theme}
                  onClick={() => { setSelectedGalleryTheme(tg.theme); setActiveSection(NavSection.ThemeGallery); }}
                  className={`w-full flex items-center transition-all duration-300 rounded-xl ${
                    isSidebarOpen ? 'p-3' : 'h-14 w-14 mx-auto justify-center mb-1'
                  } ${
                    activeSection === NavSection.ThemeGallery && selectedGalleryTheme === tg.theme 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500'
                  }`}
                  title={!isSidebarOpen ? tg.theme : ""}
                >
                  <div className={`shrink-0 ${activeSection === NavSection.ThemeGallery && selectedGalleryTheme === tg.theme ? 'text-white' : tg.color}`}>
                    {tg.icon}
                  </div>
                  {isSidebarOpen && <span className={`ml-4 text-[14px] font-bold truncate ${activeSection === NavSection.ThemeGallery && selectedGalleryTheme === tg.theme ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>{tg.theme}</span>}
                </button>
              ))}
            </div>

            <div className="space-y-1 pb-10">
              {isSidebarOpen && <p className="text-[11.5px] font-black text-slate-400 px-4 mb-3 uppercase tracking-[0.3em]">Ferramentas</p>}
              <SidebarItem 
                active={activeSection === NavSection.QuickNotes} 
                onClick={() => setActiveSection(NavSection.QuickNotes)} 
                icon={<StickyNote size={18} />} 
                label="Bloco de Notas" 
                isOpen={isSidebarOpen}
                colorClass="text-amber-500"
              />
              <SidebarItem 
                active={activeSection === NavSection.Translator} 
                onClick={() => setActiveSection(NavSection.Translator)} 
                icon={<Languages size={18} />} 
                label="Tradutor" 
                isOpen={isSidebarOpen}
                colorClass="text-blue-500"
              />
              <SidebarItem 
                active={activeSection === NavSection.BiblicalCommentary} 
                onClick={() => setActiveSection(NavSection.BiblicalCommentary)} 
                icon={<MessageSquare size={18} />} 
                label="Comentário IA" 
                isOpen={isSidebarOpen}
                colorClass="text-violet-500"
              />
              <SidebarItem 
                active={activeSection === NavSection.BiblicalBiography} 
                onClick={() => setActiveSection(NavSection.BiblicalBiography)} 
                icon={<UserCheck size={18} />} 
                label="Pesquisa Biográfica" 
                isOpen={isSidebarOpen}
                colorClass="text-rose-500"
              />
              <SidebarItem 
                active={activeSection === NavSection.BiblicalDeepDive} 
                onClick={() => setActiveSection(NavSection.BiblicalDeepDive)} 
                icon={<SearchCode size={18} />} 
                label="Imersão Exegética" 
                isOpen={isSidebarOpen}
                colorClass="text-sky-600"
              />
              <SidebarItem 
                active={activeSection === NavSection.ChronologicalTimeline} 
                onClick={() => setActiveSection(NavSection.ChronologicalTimeline)} 
                icon={<Signpost size={18} />} 
                label="Linha do Tempo" 
                isOpen={isSidebarOpen}
                colorClass="text-orange-500"
              />
              <SidebarItem 
                active={activeSection === NavSection.Dictionary} 
                onClick={() => setActiveSection(NavSection.Dictionary)} 
                icon={<BookMarked size={18} />} 
                label="Dicionário Teológico" 
                isOpen={isSidebarOpen}
                colorClass="text-cyan-500"
              />
              <SidebarItem 
                active={activeSection === NavSection.PortugueseDictionary} 
                onClick={() => setActiveSection(NavSection.PortugueseDictionary)} 
                icon={<Book size={18} />} 
                label="Dicionário PT-BR" 
                isOpen={isSidebarOpen}
                colorClass="text-emerald-500"
              />
            </div>
          </nav>

          <div className={`p-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-1 transition-all duration-500 ${!isSidebarOpen && 'items-center mt-4'}`}>
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`flex items-center bg-slate-50 dark:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 ${
                  isSidebarOpen ? 'w-full py-1.5 px-3' : 'w-10 h-10 justify-center mb-1'
                }`}
                title="Alternar Tema"
             >
                {isDarkMode ? <Sun size={14} className="text-amber-500 shrink-0" /> : <Moon size={14} className="text-emerald-500 shrink-0" />}
                {isSidebarOpen && <span className="ml-3 text-[10.5px] font-black uppercase tracking-widest text-slate-500 truncate">Modo {isDarkMode ? 'Claro' : 'Escuro'}</span>}
             </button>

             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className={`flex items-center bg-slate-50 dark:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10 group ${
                  isSidebarOpen ? 'w-full py-1.5 px-3' : 'w-10 h-10 justify-center'
                }`}
                title={isSidebarOpen ? "Recolher" : "Expandir"}
             >
                <MoreVertical size={14} className={`text-slate-400 transition-transform duration-500 group-hover:text-emerald-600 ${!isSidebarOpen ? 'rotate-90' : 'rotate-0'}`} />
                {isSidebarOpen && <span className="ml-3 text-[10.5px] font-black uppercase tracking-widest text-slate-500 truncate">Recuar Menu</span>}
             </button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
        ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-28'} p-6 lg:p-14 w-full overflow-x-hidden`}>
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 animate-in fade-in duration-700">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {activeSection === NavSection.ThemeGallery ? selectedGalleryTheme : 
               activeSection === NavSection.Dashboard ? 'Painel Central' :
               activeSection === NavSection.Generator ? 'Editor' : 
               activeSection === NavSection.Bible ? 'Escrituras' : 
               activeSection === NavSection.UniversalSearch ? 'Oráculo IA' : 
               activeSection === NavSection.BiblicalBiography ? 'Biografias' : 
               activeSection === NavSection.BiblicalDeepDive ? 'Imersão Exegética' : 'Acervo'}
            </h2>
          </div>
          
          <div className="px-6 py-3 bg-white dark:bg-[#0A0A0A] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-4 lg:gap-6 w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"><Calendar size={16} className="text-emerald-600" /> {currentTime.toLocaleDateString('pt-BR')}</div>
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 shrink-0"></div>
            <div className="flex items-center gap-3 text-slate-900 dark:text-white text-[10px] font-black tracking-widest whitespace-nowrap"><Clock size={16} className="text-emerald-600" /> {currentTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
        </header>

        <section className="animate-in fade-in duration-1000">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label, isOpen, highlight, colorClass }: any) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center transition-all duration-300 rounded-xl ${
      isOpen ? 'p-3' : 'h-14 w-14 mx-auto justify-center mb-1'
    } ${
      active ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 
      highlight ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' : 
      'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500'
    }`}
    title={!isOpen ? label : ""}
  >
    <div className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110 text-white' : highlight ? 'text-emerald-600' : `${colorClass || 'text-slate-500'}`}`}>
      {icon}
    </div>
    {isOpen && <span className={`ml-4 text-[15px] font-black tracking-tight ${active ? 'text-white' : 'text-slate-700 dark:text-slate-300'} truncate whitespace-nowrap`}>{label}</span>}
  </button>
);

export default App;
