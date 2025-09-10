import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ isDark, toggleTheme }) => {
  return (
    <header className={`p-4 shadow-md transition-colors ${
      isDark 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Todo App</h1>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Built with React + Vite
          </p>
        </div>
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};

export default Header;