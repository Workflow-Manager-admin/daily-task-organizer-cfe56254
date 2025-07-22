import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Sidebar for category navigation, shows categories and trigger for all tasks.
 */
export default function Sidebar({ categories, current, onChange }) {
  return (
    <nav className="sidebar">
      <div 
        className={`sidebar-item${!current ? ' selected' : ''}`}
        onClick={() => onChange('')}
        tabIndex={0}
      >
        All Tasks
      </div>
      {categories.map(cat => (
        <div
          key={cat}
          className={`sidebar-item${current === cat ? ' selected' : ''}`}
          onClick={() => onChange(cat)}
          tabIndex={0}
        >
          #{cat}
        </div>
      ))}
    </nav>
  );
}

Sidebar.propTypes = {
  categories: PropTypes.array.isRequired,
  current: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
