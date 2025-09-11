import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TodoApp from './components/TodoApp';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gray-100'
    }`}>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <div className="container mx-auto px-4 py-8">
        <TodoApp isDark={isDark} />
      </div>
    </div>
  );
}

export default App;