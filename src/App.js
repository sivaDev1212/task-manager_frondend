
import './App.css';
import Login from './components/Login';
import DashBoard from './components/DashBoard';
import TaskList from './components/TaskList';
// import Test from './components/Test';
// import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';


function App() {
  const loginCheck = localStorage.getItem('loginKey'); // Check if the user is logged in

  return (
    <div className="App">
      <Router>
        {/* <Test /> */}
        <Routes>
          {/* Public Route: Login */}
          <Route
            path="/login"
            element={
              !loginCheck ? <Login /> : <Navigate to="/" replace />
            }
          />

          {/* Protected Route: Dashboard */}
          <Route
            path="/"
            element={
              loginCheck ? <DashBoard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/tasklist"
            element={
              loginCheck ?  <TaskList /> : <Navigate to="/login" replace />
            }
          />

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to={loginCheck ? "/" : "/login"} replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
