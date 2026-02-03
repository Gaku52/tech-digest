import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバル型定義
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// シングルトンパターンでPrismaClientを初期化
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// 開発環境ではホットリロード時にクライアントを再利用
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// データベース接続のヘルパー関数
export async function connectToDatabase() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
}

// データベース切断のヘルパー関数
export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Failed to disconnect from database:', error);
  }
}
