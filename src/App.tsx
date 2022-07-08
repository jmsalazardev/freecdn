import React from 'react';
import 'reflect-metadata';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import Home from './routes/home';
import Albums from './routes/albums';
import Album from './routes/album';
import Photo from './routes/photo';
import { appConfig } from './config'
import './App.css';
import Login from './routes/login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LicenseInfo } from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(appConfig.license);

function App() {
  return (
    <div className="App" id="app">
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

          <Route path='/albums/:albumId/photo/:id' element={
            <ProtectedRoute>
              <Photo />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      </StyledEngineProvider>
    </div>
  );
}


export default App;
