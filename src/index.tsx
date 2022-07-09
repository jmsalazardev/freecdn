import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { StyledEngineProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </StyledEngineProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
