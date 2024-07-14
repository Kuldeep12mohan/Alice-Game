import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { MyProvider } from './context.jsx';

function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserLeaving = (event) => {
      localStorage.removeItem("userId");
      localStorage.removeItem("ownerId");
      localStorage.removeItem("roomId");
      localStorage.removeItem("username");
      navigate("/");
      console.log("User is leaving");
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleUserLeaving);

    return () => {
      window.removeEventListener('beforeunload', handleUserLeaving);
    };
  }, [navigate]);

  return (
    <React.StrictMode>
      <MyProvider>
        <App />
      </MyProvider>
    </React.StrictMode>
  );
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppWithRouter />
);
