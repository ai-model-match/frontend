import { createRoot } from 'react-dom/client';
import App from './App';
import React from 'react';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
    <React.StrictMode>
        < App />
    </React.StrictMode>
);
