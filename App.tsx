import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { setupMirageServer } from './src/services/mirageServer';

export default function App() {
  useEffect(() => {
    // Inicializar o servidor MirageJS
    if (process.env.NODE_ENV === 'development') {
      setupMirageServer();
    }
  }, []);

  return (
    <>
     
      <StatusBar style="auto" />
    </>
  );
}

