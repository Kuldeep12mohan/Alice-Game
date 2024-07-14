import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { MyProvider } from './context.jsx';
import { useNavigate } from 'react-router-dom';

function Root() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleUserLeaving = (event) => {
      localStorage.removeItem("userId");
      localStorage.removeItem("ownerId");
      localStorage.removeItem("roomId");
      localStorage.removeItem("username");
      navigate("/")
      console.log("user leaving");
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleUserLeaving);

    return () => {
      window.removeEventListener('beforeunload', handleUserLeaving);
    };
  }, []);

  return (
    <React.StrictMode>
      <MyProvider>
        <App />
      </MyProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root />
);
