/**
 * Database Configuration - Singleton Pattern
 *
 * This class implements the Singleton Design Pattern to ensure
 * only one instance of database connection exists throughout the application.
 *
 * Design Pattern: Singleton
 * - Single instance: Only one database connection
 * - Global access: Static getInstance() method
 * - Lazy initialization: Connection created on first access
 */

const mongoose = require('mongoose');

class Database {
  constructor() {
    // If instance already exists, return it (Singleton Pattern)
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = null;
    this.isConnected = false;

    // Store the instance
    Database.instance = this;
  }

  /**
   * Get the singleton instance
   * @returns {Database} The singleton Database instance
   */
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Connect to MongoDB
   * @param {string} connectionString - MongoDB connection string
   * @returns {Promise<void>}
   */
  async connect(connectionString) {
    // If already connected, return existing connection
    if (this.isConnected) {
      console.log('Database already connected');
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      this.isConnected = true;
      console.log('MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      return this.connection;
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB disconnected successfully');
    }
  }

  /**
   * Get connection status
   * @returns {boolean} Connection status
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Get Mongoose connection
   * @returns {Connection} Mongoose connection object
   */
  getConnection() {
    return mongoose.connection;
  }
}

module.exports = Database.getInstance();
