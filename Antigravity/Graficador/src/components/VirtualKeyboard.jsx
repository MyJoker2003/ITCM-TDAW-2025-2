import React from 'react';
import { ChevronDown } from 'lucide-react';

const KEYS = [
  // Row 1
  { label: 'x', value: 'x' },
  { label: 'y', value: 'y' },
  { label: 'π', value: 'π' },
  { label: 'e', value: 'e' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '÷', value: '÷' },

  // Row 2
  { label: 'x²', value: '²' },
  { label: 'a^b', value: '^' },
  { label: '√', value: '√(' },
  { label: '|a|', value: 'abs(' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '×', value: '×' },

  // Row 3
  { label: 'sin', value: 'sin(' },
  { label: 'cos', value: 'cos(' },
  { label: 'tan', value: 'tan(' },
  { label: '(', value: '(' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '−', value: '-' }, // Minus

  // Row 4
  { label: ')', value: ')' },
  { label: ',', value: ',' },
  { label: 'ans', value: 'ans' }, // Placeholder
  { label: '⌫', value: 'BACKSPACE', special: true },
  { label: '0', value: '0' },
  { label: '.', value: '.' },
  { label: '=', value: '=' }, // Maybe for solving? or just purely graphing
  { label: '+', value: '+' },
];

const MathKey = ({ label, onClick, special }) => (
  <button
    className={`math-key ${special ? 'special' : ''}`}
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()} // Prevent stealing focus functionality
  >
    {label}
  </button>
);

const VirtualKeyboard = ({ isOpen, onClose, onKeyPress }) => {
  if (!isOpen) return null;

  return (
    <div className="virtual-keyboard">
      <div className="keyboard-header">
        <span className="kb-title">Math Keyboard</span>
        <button onClick={onClose} className="close-btn"><ChevronDown /></button>
      </div>

      <div className="keys-grid">
        {KEYS.map((key, idx) => (
          <div key={idx} className="key-wrapper">
            <MathKey
              label={key.label}
              special={key.special}
              onClick={() => onKeyPress(key.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
