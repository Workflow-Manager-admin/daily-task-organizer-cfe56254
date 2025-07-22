import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Renders a task editing/adding form. Calls onSave(task) when submitted, onCancel() when cancelled.
 * @param {task} object (existing task or defaults)
 * @param {categories} array of string (available categories)
 * @param {onSave} function(task)
 * @param {onCancel} function()
 */
export default function TaskForm({ task, categories, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setDueDate(task?.due_date ? task.due_date.slice(0, 10) : '');
    setCategory(task?.category || '');
    setCompleted(!!task?.completed);
  }, [task]);

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    const result = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      category: category.trim() || null,
      completed,
    };
    if (task?.id) {
      result.id = task.id;
    }
    onSave(result);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} autoComplete="off">
      <div>
        <input
          type="text"
          className="input"
          placeholder="Task title"
          value={title}
          maxLength={74}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          className="input"
          placeholder="Description (optional)"
          value={description}
          maxLength={240}
          rows={2}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label>
          Due date:
          <input
            type="date"
            className="input"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            className="input"
            list="category-list"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="(none)"
          />
          <datalist id="category-list">
            {categories.map(c => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={completed}
            onChange={e => setCompleted(e.target.checked)}
          />{' '}
          Completed
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="action-btn accent">Save</button>
        <button type="button" className="action-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

TaskForm.propTypes = {
  task: PropTypes.object,
  categories: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
