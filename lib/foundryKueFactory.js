'use strict';

const JobCreationServiceFactory = require('./creation/jobCreationServiceFactory');
const JobProcessingServiceFactory = require('./processing/jobProcessingServiceFactory');
const QueueFactory = require('./queueFactory');

class FoundryKueFactory {

  /**
   * @returns {JobCreationServiceFactory}
   */
  static jobCreationServiceFactory() {
    return JobCreationServiceFactory;
  }

  /**
   * @returns {JobProcessingServiceFactory}
   */
  static jobProcessingServiceFactory() {
    return JobProcessingServiceFactory;
  }

  /**
   * @returns {QueueFactory}
   */
  static queueFactory() {
    return QueueFactory;
  }

}

module.exports = FoundryKueFactory;