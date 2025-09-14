// Simple server test
import app from './src/app';
import connectDB from './src/config/db';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('�� Connecting to database...');
    await connectDB();
    
    console.log('🚀 Starting server...');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 API base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
