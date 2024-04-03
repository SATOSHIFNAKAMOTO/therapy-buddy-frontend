// App.js
import React from 'react'; //  Always needed for React components
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import for routing
import HomePage from './components/HomePage';
import TherapyAI from './components/TherapyAI'; 
import Journal from './components/Journal'; // Assuming you'll create this component later
import MoodTracker from './components/MoodTracker'; // Assuming you'll create this later

function App() {
  return (
    <BrowserRouter> {/* Wrap your app with the browser router */}
      <Routes> {/* Define your routes here */}
         <Route path="/" element={<HomePage />} /> 
         <Route path="/therapy-ai" element={<TherapyAI />} />
         <Route path="/journal" element={<Journal />} />  
         <Route path="/mood-tracker" element={<MoodTracker />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
