import React, { useState, useEffect, useRef } from 'react';
import { Keyboard as KeyboardIcon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import VirtualKeyboard from './components/VirtualKeyboard';
import { generateRandomColor, isValidExpression, parseExpression } from './utils/mathUtils';

const App = () => {
  const [functions, setFunctions] = useState([
    { id: '1', rawExpression: '', compiledExpression: '', color: generateRandomColor(), visible: true, valid: true }
  ]);
  const [view, setView] = useState({ center: { x: 0, y: 0 }, zoom: 50 });
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [focusedInputId, setFocusedInputId] = useState('1');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Ensure there's always an empty function at the bottom
  useEffect(() => {
    const lastFunc = functions[functions.length - 1];
    if (lastFunc && lastFunc.rawExpression.trim() !== '') {
      const usedColors = functions.map(f => f.color);
      setFunctions(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          rawExpression: '',
          compiledExpression: '',
          color: generateRandomColor(usedColors),
          visible: true,
          valid: true
        }
      ]);
    }
  }, [functions]);

  // Update compiled expression when raw changes
  const updateFunction = (id, updates) => {
    setFunctions(prev => prev.map(f => {
      if (f.id !== id) return f;

      const newFunc = { ...f, ...updates };

      // If expression changed, revalidate and recompile
      if (updates.rawExpression !== undefined) {
        const raw = updates.rawExpression;
        if (raw.trim() === '') {
          newFunc.valid = true;
          newFunc.compiledExpression = '';
        } else {
          const valid = isValidExpression(raw);
          newFunc.valid = valid;
          newFunc.compiledExpression = valid ? parseExpression(raw) : '';
        }
      }
      return newFunc;
    }));
  };

  const handleDelete = (id) => {
    if (functions.length <= 1) {
      // Clear instead of delete if it's the only one
      updateFunction(id, { rawExpression: '' });
      return;
    }
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const handleKeyboardPress = (val) => {
    if (!focusedInputId) return;

    setFunctions(prev => prev.map(f => {
      if (f.id !== focusedInputId) return f;

      let newVal = f.rawExpression;
      if (val === 'BACKSPACE') {
        newVal = newVal.slice(0, -1);
      } else {
        newVal += val;
      }

      // We need to re-run the update logic
      const valid = isValidExpression(newVal);
      return {
        ...f,
        rawExpression: newVal,
        valid: valid,
        compiledExpression: valid ? parseExpression(newVal) : ''
      };
    }));
  };

  const openKeyboard = () => {
    setIsKeyboardOpen(true);
    if (sidebarCollapsed) setSidebarCollapsed(false);
  };

  return (
    <div className="app-container">
      {/* Top Section: Sidebar + Canvas */}
      <div className="main-area" style={{ height: isKeyboardOpen ? 'calc(100vh - 300px)' : '100vh' }}>
        <Sidebar
          functions={functions}
          onUpdateFunction={updateFunction}
          onDeleteFunction={handleDelete}
          focusedInputId={focusedInputId}
          setFocusedInputId={setFocusedInputId}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeKeyboard={isKeyboardOpen}
        />

        <div className="canvas-wrapper">
          <GraphCanvas
            functions={functions}
            view={view}
            setView={setView}
          />

          {!isKeyboardOpen && (
            <button className="keyboard-toggle" onClick={openKeyboard}>
              <KeyboardIcon size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Section: Keyboard */}
      <VirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleKeyboardPress}
      />
    </div>
  );
};

export default App;
