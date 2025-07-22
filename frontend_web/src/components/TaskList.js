import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Renders the list of tasks with edit/delete/complete options.
 * @param {tasks} array of task objects
 * @param {onEdit} function(task)
 * @param {onDelete} function(task)
 * @param {onToggleComplete} function(task)
 */
export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
  if (!tasks.length) {
    return (
      <div style={{ textAlign: 'center', color: '#b0b0b0', marginTop: '2rem' }}>
        No tasks found. Add your first!
      </div>
    );
  }
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li
          key={task.id}
          className={`task-item${task.completed ? ' completed' : ''}`}
        >
          <label className="task-checkbox">
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => onToggleComplete(task)}
              aria-label={`Mark ${task.title} as completed`}
            />
          </label>
          <div className="task-details">
            <div className="task-title">{task.title}</div>
            <div className="task-meta">
              {task.due_date && (
                <span className="task-date">Due: {new Date(task.due_date).toLocaleDateString()}</span>
              )}
              {task.category && (
                <span className="task-category">#{task.category}</span>
              )}
            </div>
            {task.description && (
              <div className="task-desc">{task.description}</div>
            )}
          </div>
          <div className="task-actions">
            <button
              className="action-btn"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              tabIndex={0}
            >
              ✏️
            </button>
            <button
              className="action-btn delete"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              tabIndex={0}
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
};
