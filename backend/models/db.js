const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/health-wellness.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Promisify database operations
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database schema
function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      googleId TEXT,
      picture TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Workouts table
  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      duration INTEGER,
      calories INTEGER,
      intensity TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // Nutrition table
  db.run(`
    CREATE TABLE IF NOT EXISTS nutrition (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      mealType TEXT NOT NULL,
      food TEXT NOT NULL,
      calories INTEGER,
      protein REAL,
      carbs REAL,
      fat REAL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // Mood entries table
  db.run(`
    CREATE TABLE IF NOT EXISTS moodEntries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      mood TEXT NOT NULL,
      rating INTEGER,
      activities TEXT,
      notes TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  console.log('Database schema initialized');
}

// User operations
const addUser = async (user) => {
  const result = await run(
    'INSERT INTO users (name, email, password, googleId, picture) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.email, user.password, user.googleId || null, user.picture || null]
  );
  user.id = result.lastID;
  user.createdAt = new Date();
  return user;
};

const getUserById = async (id) => {
  return await get('SELECT * FROM users WHERE id = ?', [id]);
};

const getUserByEmail = async (email) => {
  return await get('SELECT * FROM users WHERE email = ?', [email]);
};

const getAllUsers = async () => {
  return await all('SELECT * FROM users');
};

// Workout operations
const addWorkout = async (workout) => {
  const result = await run(
    'INSERT INTO workouts (userId, type, duration, calories, intensity, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [workout.userId, workout.type, workout.duration, workout.calories, workout.intensity, workout.notes || null]
  );
  workout.id = result.lastID;
  workout.date = new Date();
  return workout;
};

const getWorkoutsByUserId = async (userId) => {
  return await all('SELECT * FROM workouts WHERE userId = ? ORDER BY date DESC', [userId]);
};

const getWorkoutsByUserIdAndDate = async (userId, startDate, endDate) => {
  return await all(
    'SELECT * FROM workouts WHERE userId = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
    [userId, startDate, endDate]
  );
};

// Nutrition operations
const addNutrition = async (nutrition) => {
  const result = await run(
    'INSERT INTO nutrition (userId, mealType, food, calories, protein, carbs, fat, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nutrition.userId, nutrition.mealType, nutrition.food, nutrition.calories, nutrition.protein, nutrition.carbs, nutrition.fat, nutrition.notes || null]
  );
  nutrition.id = result.lastID;
  nutrition.date = new Date();
  return nutrition;
};

const getNutritionByUserId = async (userId) => {
  return await all('SELECT * FROM nutrition WHERE userId = ? ORDER BY date DESC', [userId]);
};

const getNutritionByUserIdAndDate = async (userId, startDate, endDate) => {
  return await all(
    'SELECT * FROM nutrition WHERE userId = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
    [userId, startDate, endDate]
  );
};

// Mood operations
const addMood = async (mood) => {
  const result = await run(
    'INSERT INTO moodEntries (userId, mood, rating, activities, notes) VALUES (?, ?, ?, ?, ?)',
    [mood.userId, mood.mood, mood.rating, mood.activities || null, mood.notes || null]
  );
  mood.id = result.lastID;
  mood.date = new Date();
  return mood;
};

const getMoodByUserId = async (userId) => {
  return await all('SELECT * FROM moodEntries WHERE userId = ? ORDER BY date DESC', [userId]);
};

const getMoodByUserIdAndDate = async (userId, startDate, endDate) => {
  return await all(
    'SELECT * FROM moodEntries WHERE userId = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
    [userId, startDate, endDate]
  );
};

// Export API
module.exports = {
  // User operations
  addUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  
  // Workout operations
  addWorkout,
  getWorkoutsByUserId,
  getWorkoutsByUserIdAndDate,
  
  // Nutrition operations
  addNutrition,
  getNutritionByUserId,
  getNutritionByUserIdAndDate,
  
  // Mood operations
  addMood,
  getMoodByUserId,
  getMoodByUserIdAndDate,
  
  // Database connection (for testing/admin)
  db
};

