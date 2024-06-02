import React from 'react';
import './App.css';
import CollegeTable from './UserTable';

function App() {
  return (
    <div className="App">
      <h1 style={{textAlign:"center"}}>Infinite Scroll Table</h1>
      <CollegeTable />
    </div>
  );
}

export default App;
