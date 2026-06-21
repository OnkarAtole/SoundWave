import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {PlayProvider} from './context/PlayContext';
import { AuthProvider } from './context/AuthContext.jsx';
import {Toaster} from "react-hot-toast"

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <PlayProvider>
    <App />
    <Toaster/>
  </PlayProvider>
  </AuthProvider>
  
)
