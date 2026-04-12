/**
 * Base Service - Interface Segregation Principle (ISP)
 *
 * This class demonstrates the Interface Segregation Principle from SOLID.
 * ISP states that clients should not be forced to depend on interfaces
 * they don't use.
 *
 * SOLID Principle: Interface Segregation Principle (ISP)
 * - Focused interface: Only essential methods
 * - Small, cohesive methods: Each method does one thing
 * - No fat interfaces: Clients implement only what they need
 *
 * This base service provides a minimal, focused interface that
 * services can extend as needed.
 */

class BaseService {
  /**
   * Constructor
   * @param {BaseRepository} repository - The repository instance
   */
  constructor(repository) {
    if (!repository) {
      throw new Error('Repository is required for service');
    }

    this.repository = repository;
  }

  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Created entity
   */
  async create(data, options = {}) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new Error(`Service error creating entity: ${error.message}`);
    }
  }

  /**
   * Find entity by ID
   * @param {string} id - Entity ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Found entity or null
   */
  async findById(id, options = {}) {
    try {
      const entity = await this.repository.findById(id);

      if (!entity && options.throwIfNotFound) {
        throw new Error('Entity not found');
      }

      return entity;
    } catch (error) {
      throw new Error(`Service error finding entity: ${error.message}`);
    }
  }

  /**
   * Find one entity by conditions
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Found entity or null
   */
  async findOne(conditions, options = {}) {
    try {
      const entity = await this.repository.findOne(conditions);

      if (!entity && options.throwIfNotFound) {
        throw new Error('Entity not found');
      }

      return entity;
    } catch (error) {
      throw new Error(`Service error finding entity: ${error.message}`);
    }
  }

  /**
   * Find all entities by conditions
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of entities
   */
  async findMany(conditions = {}, options = {}) {
    try {
      return await this.repository.findMany(conditions, options);
    } catch (error) {
      throw new Error(`Service error finding entities: ${error.message}`);
    }
  }

  /**
   * Update entity by ID
   * @param {string} id - Entity ID
   * @param {Object} updates - Fields to update
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Updated entity or null
   */
  async updateById(id, updates, options = {}) {
    try {
      const entity = await this.repository.updateById(id, updates);

      if (!entity && options.throwIfNotFound) {
        throw new Error('Entity not found');
      }

      return entity;
    } catch (error) {
      throw new Error(`Service error updating entity: ${error.message}`);
    }
  }

  /**
   * Delete entity by ID
   * @param {string} id - Entity ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Deleted entity or null
   */
  async deleteById(id, options = {}) {
    try {
      const entity = await this.repository.deleteById(id);

      if (!entity && options.throwIfNotFound) {
        throw new Error('Entity not found');
      }

      return entity;
    } catch (error) {
      throw new Error(`Service error deleting entity: ${error.message}`);
    }
  }

  /**
   * Count entities by conditions
   * @param {Object} conditions - Search conditions
   * @returns {Promise<number>} Count of entities
   */
  async count(conditions = {}) {
    try {
      return await this.repository.count(conditions);
    } catch (error) {
      throw new Error(`Service error counting entities: ${error.message}`);
    }
  }

  /**
   * Check if entity exists
   * @param {Object} conditions - Search conditions
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(conditions) {
    try {
      return await this.repository.exists(conditions);
    } catch (error) {
      throw new Error(`Service error checking entity existence: ${error.message}`);
    }
  }
}

module.exports = BaseService;
