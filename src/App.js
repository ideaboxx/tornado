import React from 'react'
import Navbar from './components/Navbar'
import Torrent from './components/Torrent'

import './App.css'

function App() {
  return (
    <div>
      <div className="w-full max-w-3xl mx-auto h-screen">
        <Navbar />
        <Torrent/>
      </div>
    </div>
  );
}

export default App;
