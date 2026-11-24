import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {consoleLogger} from './utils/consoleLogger';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

consoleLogger.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
