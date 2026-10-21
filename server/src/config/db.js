import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coastroadcapital';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[CRC Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[CRC Database] Connection warning: ${err.message}`);
    console.log('[CRC Database] Running with memory fallback for inquiry handling if DB is unavailable.');
    return null;
  }
}
