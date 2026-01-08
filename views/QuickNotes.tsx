
import React, { useState, useEffect, useRef } from 'react';
import { QuickNote } from '../types';
import { Plus, Trash2, StickyNote, X, Palette, ChevronRight, Edit2, AlertCircle } from 'lucide-react';

const QuickNotes: React.FC = () => {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem('kerygma_notes');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });
  
  const [modalState, setModalState] = useState<{ isOpen: boolean; editingId: string | null }>({
    isOpen: false,
    editingId: null
  });
  
  const [expandedNote, setExpandedNote] = useState<QuickNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null); // Estado para o modal de confirmação
  const [noteForm, setNoteForm] = useState({ title: '', color: 'emerald' });
  const contentInputRef = useRef<HTMLDivElement>(null);

  const colors = [
    { name: 'emerald', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50/50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
    { name: 'rose', bg: 'bg-rose-500', lightBg: 'bg-rose-50/50 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', text: 'text-rose-600 dark:text-rose-400' },
    { name: 'amber', bg: 'bg-amber-500', lightBg: 'bg-amber-50/50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
    { name: 'blue', bg: 'bg-blue-500', lightBg: 'bg-blue-50/50 dark:bg-blue-500/10', border: 'border-blue-100 dark:border-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
    { name: 'slate', bg: 'bg-slate-500', lightBg: 'bg-slate-50/50 dark:bg-slate-500/10', border: 'border-slate-100 dark:border-slate-500/20', text: 'text-slate-600 dark:text-slate-400' },
  ];

  useEffect(() => {
    localStorage.setItem('kerygma_notes', JSON.stringify(notes));
  }, [notes]);

  const handleOpenModal = (note?: QuickNote) => {
    if (note) {
      setModalState({ isOpen: true, editingId: note.id });
      setNoteForm({ title: note.title, color: note.color });
      setTimeout(() => {
        if (contentInputRef.current) contentInputRef.current.innerHTML = note.content;
      }, 0);
    } else {
      setModalState({ isOpen: true, editingId: null });
      setNoteForm({ title: '', color: 'emerald' });
      setTimeout(() => {
        if (contentInputRef.current) contentInputRef.current.innerHTML = '';
      }, 0);
    }
  };

  const handleSaveNote = () => {
    const content = contentInputRef.current?.innerHTML || '';
    if (!content.trim() || content === '<br>') return;

    if (modalState.editingId) {
      setNotes(prev => prev.map(n => n.id === modalState.editingId ? {
        ...n,
        title: noteForm.title || 'Insight',
        content,
        color: noteForm.color
      } : n));
    } else {
      const note = { 
        id: Date.now().toString(), 
        title: noteForm.title || 'Insight', 
        content, 
        color: noteForm.color, 
        createdAt: new Date().toLocaleDateString('pt-BR') 
      };
      setNotes(prev => [note, ...prev]);
    }
    
    setModalState({ isOpen: false, editingId: null });
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      setNotes(prev => prev.filter(n => n.id !== noteToDelete));
      if (expandedNote?.id === noteToDelete) setExpandedNote(null);
      setNoteToDelete(null);
    }
  };

  const getColorConfig = (colorName: string) => colors.find(c => c.name === colorName) || colors[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black flex items-center gap-4 dark:text-white uppercase tracking-tighter"><div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div> Notas de Estudo</h2>
        <button onClick={() => handleOpenModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">Nova Nota</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.length > 0 ? notes.map(note => {
          const config = getColorConfig(note.color);
          return (
            <div 
              key={note.id} 
              onClick={() => setExpandedNote(note)} 
              className={`group relative p-7 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer min-h-[220px] flex flex-col justify-between overflow-hidden backdrop-blur-sm ${config.lightBg} ${config.border}`}
            >
              <div className={`absolute -top-10 -right-10 w-24 h-24 blur-[40px] opacity-20 transition-all duration-700 ${config.bg}`}></div>
              
              <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">{note.createdAt}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOpenModal(note); }} 
                      className="p-2 text-slate-400 hover:text-emerald-500 transition-all" 
                      title="Editar"
                    >
                      <Edit2 size={14}/>
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNoteToDelete(note.id); }} 
                      className="p-2 text-slate-400 hover:text-rose-500 transition-all" 
                      title="Excluir"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
                <h4 className={`text-lg font-black leading-tight transition-colors duration-500 uppercase tracking-tighter relative z-10 ${config.text.split(' ')[0] === 'text-slate-600' ? 'text-slate-900 dark:text-white' : config.text}`}>
                  {note.title}
                </h4>
                <div 
                  className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-3 font-medium leading-relaxed relative z-10" 
                  dangerouslySetInnerHTML={{ __html: note.content }} 
                />
              </div>
              
              <div className={`mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex items-center text-[8px] font-black uppercase tracking-[0.3em] gap-2 relative z-10 ${config.text}`}>
                Acessar <ChevronRight size={12} />
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center opacity-30 border-2 border-dashed rounded-[3rem] border-slate-100 dark:border-white/5"><StickyNote size={60} className="mx-auto mb-4" /><p className="font-black uppercase tracking-[0.4em] text-lg">Nenhum Insight</p></div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO CUSTOMIZADO */}
      {noteToDelete && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <div className="bg-white dark:bg-[#0A0A0A] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black mb-3 uppercase tracking-tighter dark:text-white">Confirmar Exclusão</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">Esta nota será removida permanentemente de seus insights de estudo.</p>
            <div className="space-y-3">
              <button 
                onClick={confirmDelete} 
                className="w-full bg-rose-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              >
                Sim, Excluir Agora
              </button>
              <button 
                onClick={() => setNoteToDelete(null)} 
                className="w-full py-3 text-slate-400 font-bold uppercase text-[8px] tracking-[0.3em] hover:text-slate-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <div className="bg-white dark:bg-[#0A0A0A] w-full max-w-lg rounded-[3rem] p-10 border border-white/10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black mb-8 uppercase tracking-tighter dark:text-white">
              {modalState.editingId ? 'Editar Insight' : 'Registrar Insight'}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Cores de Organização</label>
                <div className="flex gap-3">
                  {colors.map(c => (
                    <button 
                      key={c.name} 
                      onClick={() => setNoteForm({...noteForm, color: c.name})} 
                      className={`w-7 h-7 rounded-full transition-all ${c.bg} ${noteForm.color === c.name ? 'ring-2 ring-emerald-600 ring-offset-2 dark:ring-offset-[#0A0A0A]' : 'opacity-40 hover:opacity-100'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Título</label>
                <input 
                  type="text" 
                  placeholder="Assunto..." 
                  value={noteForm.title} 
                  onChange={e => setNoteForm({...noteForm, title: e.target.value})} 
                  className="w-full bg-slate-50 dark:bg-white/5 rounded-xl p-4 font-bold outline-none dark:text-white border border-transparent focus:border-emerald-500/20 transition-all text-sm" 
                />
              </div>
              
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Mensagem</label>
                <div 
                  ref={contentInputRef} 
                  contentEditable 
                  className="w-full bg-slate-50 dark:bg-white/5 rounded-xl p-5 min-h-[120px] outline-none font-medium dark:text-white overflow-y-auto border border-transparent focus:border-emerald-500/20 transition-all text-sm" 
                  data-placeholder="Escreva sua revelação..." 
                />
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button onClick={handleSaveNote} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
                {modalState.editingId ? 'Salvar Alterações' : 'Salvar Insight'}
              </button>
              <button onClick={() => setModalState({ isOpen: false, editingId: null })} className="w-full py-3 text-slate-400 font-bold uppercase text-[8px] tracking-[0.3em] hover:text-rose-500 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {expandedNote && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl">
           <div className={`w-full max-w-2xl rounded-[3.5rem] p-12 max-h-[85vh] overflow-y-auto border border-white/5 shadow-2xl relative transition-all duration-700 bg-white dark:bg-[#050505]`}>
              <div className="flex justify-between items-start mb-10">
                <div className="flex-1">
                   <span className={`text-[9px] font-black uppercase tracking-[0.4em] mb-3 block ${getColorConfig(expandedNote.color).text}`}>{expandedNote.createdAt}</span>
                   <h2 className="text-3xl font-black leading-tight text-slate-900 dark:text-white tracking-tighter uppercase">{expandedNote.title}</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedNote(null); handleOpenModal(expandedNote); }} 
                    className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-emerald-50 transition-all text-slate-400 hover:text-emerald-500" 
                    title="Editar"
                  >
                    <Edit2 size={20}/>
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNoteToDelete(expandedNote.id); }} 
                    className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-rose-50 transition-all text-slate-400 hover:text-rose-500" 
                    title="Excluir"
                  >
                    <Trash2 size={20}/>
                  </button>
                  <button onClick={() => setExpandedNote(null)} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900" title="Fechar"><X size={20}/></button>
                </div>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-serif leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: expandedNote.content }} />
           </div>
        </div>
      )}
      <style>{`
        [contentEditable]:empty:before { content: attr(data-placeholder); color: #94a3b8; font-style: italic; }
        .dark [contentEditable]:empty:before { color: #475569; }
      `}</style>
    </div>
  );
};

export default QuickNotes;
