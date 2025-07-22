import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Simple header with navigation title on top bar.
 */
export default function Header() {
  return (
    <header className="app-header">
      <span className="header-title">📝 Daily Task Organizer</span>
      <nav className="header-nav">
        <span className="header-link" tabIndex={0}>Tasks</span>
      </nav>
    </header>
  );
}
