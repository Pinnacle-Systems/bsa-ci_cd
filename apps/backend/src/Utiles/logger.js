import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

/**
 * Custom error logging utility.
 * Extracts the function name and line number from the error stack
 * and saves the log to the database.
 *
 * @param {Error} err - The error object to log
 * @param {Object} req - The express request object (optional, for userId)
 */
export const logError = async (err, req = null) => {
  try {
    let functionName = "Unknown";
    let lineNumber = "Unknown";

    if (err && err.stack) {
      // Parse the stack trace
      const stackLines = err.stack.split("\n");
      // Usually, the first line is the error message, and the second line is the origin
      const originLine = stackLines[1] || "";
      
      // Match pattern like: at functionName (filePath:lineNumber:columnNumber)
      const match1 = originLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
      // Match pattern like: at filePath:lineNumber:columnNumber
      const match2 = originLine.match(/at\s+(.*):(\d+):(\d+)/);

      if (match1) {
        functionName = match1[1];
        lineNumber = match1[3];
      } else if (match2) {
        functionName = "anonymous";
        lineNumber = match2[2];
      }
    }

    // Try to extract user id from request if available
    let userId = null;
    if (req) {
      // Adjust this based on where the user ID is stored in your app
      userId = req.body?.Idcard || req.user?.id || req.headers['userid'] || null;
    }

    // Save to database
    await prisma.errorLog.create({
      data: {
        datetime: new Date(),
        userId: userId ? String(userId) : null,
        functionName: functionName,
        lineNumber: lineNumber,
        message: err.message || "Unknown error",
        stack: err.stack || "",
      }
    });

  } catch (loggingErr) {
    console.error("Failed to save error log to database:", loggingErr);
  }
};
