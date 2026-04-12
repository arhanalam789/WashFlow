/**
 * Base Repository - Abstraction
 *
 * This class demonstrates Abstraction, one of the four core OOP concepts.
 * Abstraction involves hiding complex implementation details and showing
 * only the necessary features of an object.
 *
 * OOP Concept: Abstraction
 * - Abstract base class: Defines the contract for repositories
 * - Method signatures: Define what operations are available
 * - Implementation hiding: Concrete classes implement the details
 *
 * This class serves as an abstract base class that defines the interface
 * that all repository implementations must follow.
 */

class BaseRepository {
  /**
   * Constructor - Should be called by child classes
   * @param {BaseModel} model - The model instance
   */
  constructor(model) {
    if (this.constructor === BaseRepository) {
      throw new Error('Abstract class BaseRepository cannot be instantiated directly');
    }

    if (!model) {
      throw new Error('Model is required for repository');
    }

    this.model = model;
  }

  /**
   * Create a new document
   * @abstract
   * @param {Object} data - Document data
   * @returns {Promise<Document>} Created document
   * @throws {Error} Must be implemented by subclass
   */
  async create(data) {
    throw new Error('Method "create()" must be implemented by subclass');
  }

  /**
   * Find document by ID
   * @abstract
   * @param {string} id - Document ID
   * @returns {Promise<Document|null>} Found document or null
   * @throws {Error} Must be implemented by subclass
   */
  async findById(id) {
    throw new Error('Method "findById()" must be implemented by subclass');
  }

  /**
   * Find one document by conditions
   * @abstract
   * @param {Object} conditions - Search conditions
   * @returns {Promise<Document|null>} Found document or null
   * @throws {Error} Must be implemented by subclass
   */
  async findOne(conditions) {
    throw new Error('Method "findOne()" must be implemented by subclass');
  }

  /**
   * Find all documents by conditions
   * @abstract
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of documents
   * @throws {Error} Must be implemented by subclass
   */
  async findMany(conditions, options) {
    throw new Error('Method "findMany()" must be implemented by subclass');
  }

  /**
   * Update document by ID
   * @abstract
   * @param {string} id - Document ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Document|null>} Updated document or null
   * @throws {Error} Must be implemented by subclass
   */
  async updateById(id, updates) {
    throw new Error('Method "updateById()" must be implemented by subclass');
  }

  /**
   * Delete document by ID
   * @abstract
   * @param {string} id - Document ID
   * @returns {Promise<Document|null>} Deleted document or null
   * @throws {Error} Must be implemented by subclass
   */
  async deleteById(id) {
    throw new Error('Method "deleteById()" must be implemented by subclass');
  }

  /**
   * Count documents by conditions
   * @abstract
   * @param {Object} conditions - Search conditions
   * @returns {Promise<number>} Count of documents
   * @throws {Error} Must be implemented by subclass
   */
  async count(conditions) {
    throw new Error('Method "count()" must be implemented by subclass');
  }

  /**
   * Check if document exists
   * @abstract
   * @param {Object} conditions - Search conditions
   * @returns {Promise<boolean>} True if exists, false otherwise
   * @throws {Error} Must be implemented by subclass
   */
  async exists(conditions) {
    throw new Error('Method "exists()" must be implemented by subclass');
  }
}

module.exports = BaseRepository;
