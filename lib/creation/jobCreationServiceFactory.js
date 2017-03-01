'use strict';

const QueueFactory = require('../queueFactory');
const JobCreationService = require('../creation/jobCreationService');

class JobCreationServiceFactory {

  /**
   * Config should match kue documentation for options as it's passed in directly to kue.createFromConfig()
   *
   * @param {Config} nodeConfig
   * @param {string} nodeConfigPath
   * @param {Logger} logger
   * @returns {JobCreationService}
   */
  static createFromNodeConfig(nodeConfig, nodeConfigPath, logger) {
    const queue = QueueFactory.createFromNodeConfig(nodeConfig, nodeConfigPath);
    return JobCreationServiceFactory.create(queue, logger);
  }

  /**
   * @param {Object} config - refer to kue documentation for options
   * @param {Logger} logger
   * @returns {JobCreationService}
   */
  static createFromConfig(config, logger) {
    const queue = QueueFactory.createFromConfig(config);
    return JobCreationServiceFactory.create(queue, logger);
  }

  /**
   * @param {Queue} queue
   * @param {Logger} logger
   * @returns {JobCreationService}
   */
  static create(queue, logger) {
    return new JobCreationService(queue, logger);
  }

}

module.exports = JobCreationServiceFactory;