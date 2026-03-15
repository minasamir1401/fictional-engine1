const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/trainings', require('./routes/trainingRoutes'));

app.get('/', (req, res) => {
  res.send('Webinar Sports PostgreSQL API is running...');
});

const PORT = process.env.PORT || 5000;

global.dbConnected = false;

// Sync Database & Start Server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL (Neon DB)');
    
    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
    
    global.dbConnected = true;
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    console.log('⚠️ Running in Local/Mock Mode');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
