// components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to Therapy Buddy</h1>
      <p>Your Mental Health Companion</p>
      <nav>
        <ul>
          <li><Link to="/therapy-ai">Chat with Therapy AI</Link></li>
          <li><Link to="/journal">Journal</Link></li> 
          <li><Link to="/mood-tracker">Mood Tracker</Link></li> 
          {/* Add more links as you create new pages */}
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;
