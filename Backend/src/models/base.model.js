/**
 * Base Model - Encapsulation
 *
 * This class demonstrates Encapsulation, one of the four core OOP concepts.
 * Encapsulation is the bundling of data and methods that operate on that data
 * within a single unit (class).
 *
 * OOP Concept: Encapsulation
 * - Data hiding: Internal schema is protected
 * - Method bundling: CRUD operations are encapsulated
 * - Access control: Public methods with controlled access to data
 */

class BaseModel {
  /**
   * @param {Schema} schema - Mongoose schema
   */
  constructor(schema) {
    // Protected property (conventionally indicated by underscore)
    this._schema = schema;
    this._modelName = schema.modelName || 'BaseModel';
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Document>} Created document
   */
  async create(data) {
    try {
      const document = new this._schema(data);
      return await document.save();
    } catch (error) {
      throw new Error(`Error creating ${this._modelName}: ${error.message}`);
    }
  }

  /**
   * Find document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Document|null>} Found document or null
   */
  async findById(id) {
    try {
      return await this._schema.findById(id);
    } catch (error) {
      throw new Error(`Error finding ${this._modelName} by ID: ${error.message}`);
    }
  }

  /**
   * Find one document by conditions
   * @param {Object} conditions - Search conditions
   * @returns {Promise<Document|null>} Found document or null
   */
  async findOne(conditions) {
    try {
      return await this._schema.findOne(conditions);
    } catch (error) {
      throw new Error(`Error finding ${this._modelName}: ${error.message}`);
    }
  }

  /**
   * Find all documents by conditions
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Query options (sort, limit, etc.)
   * @returns {Promise<Array>} Array of documents
   */
  async findMany(conditions = {}, options = {}) {
    try {
      let query = this._schema.find(conditions);

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.skip) {
        query = query.skip(options.skip);
      }

      if (options.populate) {
        query = query.populate(options.populate);
      }

      return await query.exec();
    } catch (error) {
      throw new Error(`Error finding ${this._modelName} multiple: ${error.message}`);
    }
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Document|null>} Updated document or null
   */
  async updateById(id, updates) {
    try {
      return await this._schema.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error updating ${this._modelName}: ${error.message}`);
    }
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Document|null>} Deleted document or null
   */
  async deleteById(id) {
    try {
      return await this._schema.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting ${this._modelName}: ${error.message}`);
    }
  }

  /**
   * Count documents by conditions
   * @param {Object} conditions - Search conditions
   * @returns {Promise<number>} Count of documents
   */
  async count(conditions = {}) {
    try {
      return await this._schema.countDocuments(conditions);
    } catch (error) {
      throw new Error(`Error counting ${this._modelName}: ${error.message}`);
    }
  }

  /**
   * Check if document exists
   * @param {Object} conditions - Search conditions
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(conditions) {
    try {
      const count = await this._schema.countDocuments(conditions);
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking ${this._modelName} existence: ${error.message}`);
    }
  }

  /**
   * Get the underlying schema
   * @returns {Schema} Mongoose schema
   */
  getSchema() {
    return this._schema;
  }
}

module.exports = BaseModel;
