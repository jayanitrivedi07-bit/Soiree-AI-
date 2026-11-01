import { app } from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`✨ Soirée AI Backend Server`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Gemini AI integration: ${env.GEMINI_API_KEY ? 'Active (gemini-3.5-flash)' : 'API Key missing'}`);
  console.log(`🗄️ Database mode: ${env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'Local Persistent In-Memory Store'}`);
  console.log(`===============================================`);
});

