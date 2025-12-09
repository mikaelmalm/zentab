"use client";

import { Settings } from '@/types';
import { X, Upload, Download, Settings as SettingsIcon } from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (s: Partial<Settings>) => void;
  onImport: (file: File) => void;
  onExport: () => void;
}

import { useEffect } from 'react';

export const SettingsModal = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
  onImport,
  onExport,
}: SettingsModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <SettingsIcon size={20} /> Settings
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-zinc-400 mb-1">Your Name</label>
               <input 
                 className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                 value={settings.userName || ''}
                 onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                 placeholder="Enter your name"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-zinc-400 mb-1">Background Image URL</label>
               <input 
                 className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                 value={settings.backgroundImageUrl || ''}
                 onChange={(e) => onUpdateSettings({ backgroundImageUrl: e.target.value })}
                 placeholder="https://images.unsplash.com/..."
               />
                <p className="text-xs text-zinc-500 mt-1">Leave empty for default gradient</p>
             </div>

             <div>
            <label className="block text-xs font-medium text-white/70 mb-1">
              Background Opacity ({settings.backgroundOpacity ?? 0}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.backgroundOpacity ?? 0}
              onChange={(e) => onUpdateSettings({ backgroundOpacity: Number(e.target.value) })}
              className="w-full accent-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">
              Weather Location (City)
            </label>
               <input 
                 className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                 value={settings.weatherCity || ''}
                 onChange={(e) => onUpdateSettings({ weatherCity: e.target.value })}
                 placeholder="e.g. London, New York, Tokyo"
               />
             </div>
             
             <div className="flex items-center gap-3">
               <input 
                 type="checkbox"
                 id="24h"
                 checked={settings.is24HourFormat}
                 onChange={(e) => onUpdateSettings({ is24HourFormat: e.target.checked })}
                 className="rounded border-zinc-700 bg-zinc-900 text-white"
               />
                <label htmlFor="24h" className="text-sm text-zinc-300">Use 24-hour clock format</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Clock Size</label>
                <div className="flex bg-zinc-950 rounded border border-zinc-800 p-1">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => onUpdateSettings({ timeDisplaySize: size as any })}
                      className={`flex-1 text-xs py-1.5 rounded capitalize transition-colors ${
                        (settings.timeDisplaySize || 'medium') === size 
                          ? 'bg-zinc-800 text-white font-medium' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

             <div className="flex items-center gap-3">
               <input 
                 type="checkbox"
                 id="cleanMode"
                 checked={settings.isCleanMode || false}
                 onChange={(e) => onUpdateSettings({ isCleanMode: e.target.checked })}
                 className="rounded border-zinc-700 bg-zinc-900 text-white"
               />
               <label htmlFor="cleanMode" className="text-sm text-zinc-300">Clean Mode (Minimalist)</label>
             </div>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Data Management */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider text-xs">Data Management</h3>
            <div className="flex gap-3">
              <button 
                onClick={onExport}
                className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
              >
                <Download size={16} /> Export Data
              </button>
              <label className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium cursor-pointer">
                <Upload size={16} /> Import Data
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImport(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
