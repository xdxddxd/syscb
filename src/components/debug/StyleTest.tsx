'use client';

export function StyleTest() {
  return (
    <>
      <style jsx>{`
        .test-container {
          padding: 2rem;
          background-color: #ef4444;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .test-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .test-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .test-card {
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .blue { background-color: #3b82f6; }
        .green { background-color: #10b981; }
        .purple { background-color: #8b5cf6; }
        .gradient {
          background: linear-gradient(to right, #ec4899, #eab308);
          margin-top: 2rem;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .button {
          padding: 0.5rem 1rem;
          margin: 0.5rem;
          border-radius: 0.25rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .button-primary {
          background-color: #4f46e5;
          color: white;
        }
        .button-primary:hover {
          background-color: #4338ca;
        }
      `}</style>
      <div className="test-container">
        <h1 className="test-title">Teste de Estilos (CSS Inline)</h1>
        <div className="test-grid">
          <div className="test-card blue">
            <h2>Azul</h2>
            <p>Teste de cor azul</p>
          </div>
          <div className="test-card green">
            <h2>Verde</h2>
            <p>Teste de cor verde</p>
          </div>
          <div className="test-card purple">
            <h2>Roxo</h2>
            <p>Teste de cor roxa</p>
          </div>
        </div>
        <div className="gradient">
          <p>Gradiente funcionando com CSS inline</p>
        </div>
        <div>
          <button className="button button-primary">
            Botão com CSS Inline
          </button>
        </div>
      </div>
      
      <div className="p-8 bg-red-500 text-white">
        <h1 className="text-4xl font-bold mb-4">Teste Tailwind (se funcionar será estilizado)</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Azul Tailwind</h2>
            <p className="text-blue-100">Este deveria ser azul se Tailwind funcionasse</p>
          </div>
        </div>
      </div>
    </>
  );
}
