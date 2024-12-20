import './App.css';
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Setting from './comp/Setting';
import Login from './comp/Login';
import Signup from './comp/Signup';
import Reset from './comp/Reset';

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Setting />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/settings/*" element={<Setting />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
