'use strict';

const QueueFactory = require('../queueFactory');
const JobProcessingService = require('./jobProcessingService');

class JobProcessingServiceFactory {

  /**
   * Config should match kue documentation for options as it's passed in directly to kue.createFromConfig()
   *
   * @param {Config} nodeConfig
   * @param {string} nodeConfigPath
   * @param {Logger} logger
   * @returns {JobProcessingService}
   */
  static createFromNodeConfig(nodeConfig, nodeConfigPath, logger) {
    const queue = QueueFactory.createFromNodeConfig(nodeConfig, nodeConfigPath);
    return JobProcessingServiceFactory.create(queue, logger);
  }

  /**
   * @param {Object} config - refer to kue documentation for options
   * @param {Logger} logger
   * @returns {JobProcessingService}
   */
  static createFromConfig(config, logger) {
    const queue = QueueFactory.createFromConfig(config);
    return JobProcessingServiceFactory.create(queue, logger);
  }

  /**
   * @param {Queue} queue
   * @param {Logger} logger
   * @returns {JobProcessingService}
   */
  static create(queue, logger) {
    return new JobProcessingService(queue, logger);
  }

}

module.exports = JobProcessingServiceFactory;