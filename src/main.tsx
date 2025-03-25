
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use createRoot API correctly
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
