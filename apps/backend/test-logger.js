import { logError } from './src/Utiles/logger.js';
import { PrismaClient } from './src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function runTest() {
  console.log("Triggering test error...");
  try {
    throw new Error("Verification test error");
  } catch (error) {
    await logError(error, null);
    console.log("Error logged to database.");
  }
  
  // Fetch from DB to verify
  const logs = await prisma.errorLog.findMany({
    orderBy: { datetime: 'desc' },
    take: 1
  });
  
  console.log("Latest log in DB:", logs);
  process.exit(0);
}

runTest();
