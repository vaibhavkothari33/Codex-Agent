import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

const TodoApp = ({ isDark }) => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { 
        id: Date.now(), 
        text: inputValue, 
        completed: false 
      }]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className={`max-w-md mx-auto mt-8 p-6 rounded-lg shadow-lg transition-colors ${
      isDark 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">
          My Todo List
        </h1>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {totalCount > 0 ? `${completedCount} of ${totalCount} completed` : 'No todos yet'}
        </p>
      </div>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className={`flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className={`flex items-center p-3 rounded-lg transition-colors ${
            isDark 
              ? 'bg-gray-700' 
              : 'bg-gray-50'
          }`}>
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`mr-3 p-1 rounded transition-colors ${
                todo.completed 
                  ? 'text-green-500 hover:text-green-600' 
                  : isDark 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {todo.completed ? <Check size={18} /> : <div className="w-[18px] h-[18px] border-2 border-current rounded"></div>}
            </button>
            <span className={`flex-1 transition-all ${
              todo.completed 
                ? `line-through ${isDark ? 'text-gray-400' : 'text-gray-500'}`
                : isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <div className="text-center mt-8">
          <div className={`text-4xl mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            📝
          </div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No todos yet. Add one above!
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoApp;