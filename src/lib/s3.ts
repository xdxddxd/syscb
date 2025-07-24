import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

const s3Config: S3ClientConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.AWS_ENDPOINT_URL || 'http://localhost:9000',
  forcePathStyle: true, // Necessário para MinIO
};

export const s3Client = new S3Client(s3Config);

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'casa-branca-files';

// Configurações específicas para diferentes tipos de arquivos
export const FILE_CONFIGS = {
  PHOTOS: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    folder: 'photos'
  },
  DOCUMENTS: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    folder: 'documents'
  },
  SELFIES: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png'],
    folder: 'selfies'
  },
  CONTRACTS: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/pdf'],
    folder: 'contracts'
  }
};
