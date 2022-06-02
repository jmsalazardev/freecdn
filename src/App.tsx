import React from 'react';
import 'reflect-metadata';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import Home from './routes/home';
import Albums from './routes/albums';
import Album from './routes/album';
import { appConfig } from './config'
import './App.css';
import Login from './routes/login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <BrowserRouter basename={appConfig.publicUrl}>
        <Routes>
        
          <Route path='/'  element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/albums' element={
            <ProtectedRoute>
              <Albums />
            </ProtectedRoute>
            } />
          <Route path='/albums/:id' element={
            <ProtectedRoute>
              <Album />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
      </StyledEngineProvider>
    </div>
  );
}


export default App;
