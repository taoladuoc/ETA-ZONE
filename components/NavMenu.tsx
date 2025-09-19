
import React from 'react';
import type { Tab } from '../types';
import { MENU_ITEMS } from '../constants';

interface NavMenuProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export const NavMenu: React.FC<NavMenuProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="flex-shrink-0 w-full md:w-64">
            <ul className="space-y-2">
                {MENU_ITEMS.map(item => (
                    <li key={item.id}>
                        <button 
                            onClick={() => setActiveTab(item.id)} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left text-sm font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                activeTab === item.id 
                                ? 'bg-cyan-500/20 text-cyan-300 shadow-md border border-cyan-500/30' 
                                : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                            }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
