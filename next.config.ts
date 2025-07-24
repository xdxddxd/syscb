import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // Configurações do Turbopack se necessário
    }
  },
  images: {
    domains: ['localhost', 'derik-minio.ddjt6d.easypanel.host'], // Adicionar domínios do MinIO/S3
  },
  // Configurações para PWA offline-first
  typescript: {
    // Permitir builds mesmo com alguns erros TypeScript durante desenvolvimento
    ignoreBuildErrors: false,
  },
  eslint: {
    // Permitir builds mesmo com alguns avisos ESLint durante desenvolvimento
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
