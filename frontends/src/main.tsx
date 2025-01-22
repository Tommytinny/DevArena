import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById('origin')!).render(
  //<StrictMode>
  <>
    <App />
    <Toaster />
  </>
  //</StrictMode>
);

