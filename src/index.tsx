import React from 'react';
import ReactDOM from 'react-dom/client';
import { PuppyTracker } from './PuppyTracker';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <PuppyTracker />
  </React.StrictMode>
);
