'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      setResult('Testando login...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'admin@sistema.com' }),
      });

      const data = await response.json();
      setResult(`Login response: ${JSON.stringify(data, null, 2)}`);
      
      // Now test verify
      setTimeout(async () => {
        const verifyResponse = await fetch('/api/auth/verify');
        const verifyData = await verifyResponse.json();
        setResult(prev => prev + `\n\nVerify response: ${JSON.stringify(verifyData, null, 2)}`);
      }, 1000);
      
    } catch (error) {
      setResult(`Erro: ${error.message}`);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie;
    setResult(`Cookies: ${cookies || 'Nenhum cookie encontrado'}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teste de Autenticação</h1>
      
      <div className="space-x-4 mb-4">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Testar Login
        </button>
        
        <button 
          onClick={checkCookies}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Verificar Cookies
        </button>
      </div>
      
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {result || 'Clique em um botão para testar...'}
      </pre>
    </div>
  );
}
