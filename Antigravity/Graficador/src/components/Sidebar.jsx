import React from 'react';
import { Trash2, Eye, EyeOff, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const FunctionInput = ({
  func,
  onUpdate,
  onDelete,
  onFocus,
  isActive
}) => {
  return (
    <div className={`function-item ${isActive ? 'active' : ''}`} style={{ borderColor: func.color }}>
      <div className="input-group">
        <button
          className="visibility-btn"
          onClick={() => onUpdate(func.id, { visible: !func.visible })}
          style={{ color: func.visible ? func.color : 'var(--text-muted)' }}
          title={func.visible ? "Hide" : "Show"}
        >
          {func.visible ?
            <div className="color-indicator" style={{ backgroundColor: func.color }} /> :
            <div className="color-indicator-stroke" style={{ borderColor: func.color }} />
          }
        </button>

        <span className="f-label" style={{ color: func.color }}>f(x) =</span>

        <input
          type="text"
          value={func.rawExpression}
          onChange={(e) => onUpdate(func.id, { rawExpression: e.target.value })}
          onFocus={() => onFocus(func.id)}
          placeholder="Enter expression..."
          className="math-input"
        />

        <button
          className="delete-btn"
          onClick={() => onDelete(func.id)}
          tabIndex="-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({
  functions,
  onUpdateFunction,
  onDeleteFunction,
  focusedInputId,
  setFocusedInputId,
  isCollapsed,
  toggleCollapse,
  activeKeyboard
}) => {
  if (isCollapsed) {
    return (
      <div className="sidebar-collapsed">
        <button onClick={toggleCollapse} className="toggle-btn">
          <ChevronRight />
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Functions</h2>
        <button onClick={toggleCollapse} className="toggle-btn">
          <ChevronLeft />
        </button>
      </div>

      <div className="function-list">
        {functions.map(func => (
          <FunctionInput
            key={func.id}
            func={func}
            onUpdate={onUpdateFunction}
            onDelete={onDeleteFunction}
            onFocus={setFocusedInputId}
            isActive={focusedInputId === func.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
