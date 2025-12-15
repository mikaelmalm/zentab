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

import { useEffect, useState } from 'react';
import { getExtensions } from "@/extensions/registry";

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

  const [activeTab, setActiveTab] = useState<'appearance' | 'general' | 'extensions'>('appearance');

  const extensions = getExtensions();

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

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'appearance' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Appearance
            {activeTab === 'appearance' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'general' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            General
            {activeTab === 'general' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('extensions')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'extensions' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Extensions
            {activeTab === 'extensions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'appearance' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Your Name</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                  value={settings.userName || ''}
                  onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Background Image URL</label>
                <input 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors text-sm"
                  value={settings.backgroundImageUrl || ''}
                  onChange={(e) => onUpdateSettings({ backgroundImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="text-xs text-zinc-500 mt-1">Leave empty for default gradient</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-zinc-400">Background Opacity</label>
                  <span className="text-xs text-zinc-500">{settings.backgroundOpacity ?? 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.backgroundOpacity ?? 0}
                  onChange={(e) => onUpdateSettings({ backgroundOpacity: Number(e.target.value) })}
                  className="w-full accent-white"
                />
              </div>
            </div>
          ) : activeTab === 'general' ? (
            <div className="space-y-5">
               <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-1.5">Weather Location</label>
                 <input 
                   className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                   value={settings.weatherCity || ''}
                   onChange={(e) => onUpdateSettings({ weatherCity: e.target.value })}
                   placeholder="e.g. London, New York, Tokyo"
                 />
               </div>

             
                 <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-1.5">Clock Size</label>
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

                 <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Date Format</label>
                    <div className="flex bg-zinc-950 rounded border border-zinc-800 p-1">
                      <button
                        onClick={() => onUpdateSettings({ dateFormat: 'short' })}
                        className={`flex-1 text-xs py-1.5 rounded transition-colors ${
                          (settings.dateFormat || 'short') === 'short' 
                            ? 'bg-zinc-800 text-white font-medium' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Short
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ dateFormat: 'long' })}
                        className={`flex-1 text-xs py-1.5 rounded transition-colors ${
                          settings.dateFormat === 'long' 
                            ? 'bg-zinc-800 text-white font-medium' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Long
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ dateFormat: 'none' })}
                        className={`flex-1 text-xs py-1.5 rounded transition-colors ${
                          settings.dateFormat === 'none' 
                            ? 'bg-zinc-800 text-white font-medium' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        None
                      </button>
                    </div>
                 </div>
        

               <div className="space-y-3 pt-2">
                 <div className="flex items-center gap-3">
                   <input 
                     type="checkbox"
                     id="searchEnabled"
                     checked={settings.isSearchEnabled ?? true}
                     onChange={(e) => onUpdateSettings({ isSearchEnabled: e.target.checked })}
                     className="rounded border-zinc-700 bg-zinc-900 text-white"
                   />
                   <label htmlFor="searchEnabled" className="text-sm text-zinc-300">Enable Search Bar</label>
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
               </div>

               <div className="h-px bg-zinc-800 my-4" />

               <div>
                 <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Data Management</h3>
                 <div className="flex gap-3">
                   <button 
                     onClick={onExport}
                     className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
                   >
                     <Download size={16} /> Export
                   </button>
                   <label className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium cursor-pointer">
                     <Upload size={16} /> Import
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
          ) : (
            <div className="space-y-6">
              {extensions.map(ext => {
                const SettingsComp = ext.settingsComponent;
                if (!SettingsComp) return null;

                const extSettings = settings.extensionSettings?.[ext.id] ?? ext.defaultSettings;

                return (
                  <div key={ext.id}>
                    <h3 className="text-sm font-medium text-white mb-2">{ext.name}</h3>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                       <SettingsComp 
                         settings={extSettings} 
                         onUpdateSettings={(newVals) => {
                           const newExtensionSettings = {
                             ...(settings.extensionSettings || {}),
                             [ext.id]: newVals,
                           };
                           onUpdateSettings({ extensionSettings: newExtensionSettings });
                         }} 
                       />
                    </div>
                  </div>
                );
              })}
              {extensions.length === 0 && (
                <div className="text-center text-zinc-500 py-8">
                  No extensions installed.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
