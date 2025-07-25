import React from 'react';
import { createRoot } from 'react-dom/client';
import SettingsPage from './components/SettingsPage';
import './styles/globals.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<SettingsPage />); 