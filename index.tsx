
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

console.log("🚀 React entry point loaded");

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="color: white; padding: 2rem;">❌ Fatal Error: Root element not found</div>';
  throw new Error("Could not find root element to mount to");
}

console.log("📦 Root element found, creating React root");

try {
const root = ReactDOM.createRoot(rootElement);
  console.log("✅ React root created, rendering app");
root.render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
);
  console.log("✅ App rendered");
} catch (err) {
  console.error("❌ React render error:", err);
  document.body.innerHTML = `<div style="color: white; padding: 2rem;">❌ React Error: ${err}</div>`;
}
