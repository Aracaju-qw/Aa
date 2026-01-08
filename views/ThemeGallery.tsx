
import React from 'react';
import Gallery from './Gallery';
import { Theme as SermonTheme, Sermon } from '../types';
import { Folder } from 'lucide-react';

interface ThemeGalleryProps {
  theme: SermonTheme;
  sermons: Sermon[];
  onDelete: (id: string) => void;
  onEdit: (sermon: Sermon) => void;
}

const ThemeGallery: React.FC<ThemeGalleryProps> = ({ theme, sermons, onDelete, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
            <Folder size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Pasta: {theme}</h3>
            <p className="text-sm text-slate-400 font-medium italic">Filtro aplicado automaticamente ao acervo.</p>
          </div>
        </div>
      </div>
      <Gallery theme={theme} sermons={sermons} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
};

export default ThemeGallery;
