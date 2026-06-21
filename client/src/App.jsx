import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalPlayer from './components/GlobalPlayer';
import Favorites from './pages/Favorites';
import Playlists from "./pages/Playlists";
import './App.css'
import MainLayout from './layouts/MainLayout';
import { Navigate } from 'react-router-dom';
import UploadSong from './pages/UploadSong';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import { useEffect } from 'react';

function App() {
  const token = localStorage.getItem("token");
 
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/home' element={
        <ProtectedRoute>
          <MainLayout>
        <Home />
        </MainLayout>
        </ProtectedRoute>} />

        <Route path='/favorites' element={
          <ProtectedRoute>
            <MainLayout>
            <Favorites />
            </MainLayout>
          </ProtectedRoute>
        }
        />

        <Route path="/playlists" element={
          <ProtectedRoute>
          <MainLayout>
          <Playlists/>
          </MainLayout>
        </ProtectedRoute>
        }
        />

           <Route
            path="/upload-song"
            element={
              <ProtectedRoute>
              <MainLayout>
                <UploadSong />
              </MainLayout>
              </ProtectedRoute>
            }
            />

           <Route
            path="/history"
            element={
              <ProtectedRoute>
              <MainLayout>
                <History />
              </MainLayout>
              </ProtectedRoute>
            }
            />

           <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
              </ProtectedRoute>
            }
            />

        

        <Route path='/login' element={<Login />} />

        <Route path="/register" element={<Register/>} />

        {/* <Route path="/" element={<Navigate to="/login"/>} /> */}
        <Route
  path="/"
  element={
    token ? (
      <Navigate to="/home" />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
        
{/*       
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}
    </Routes>
    <GlobalPlayer />
    </BrowserRouter>
    
  )
}

export default App;
