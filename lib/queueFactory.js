'use strict';

const Kue = require('kue-scheduler');

class QueueFactory {

  /**
   * Config should match kue documentation for options as it's passed in directly to kue.createFromConfig()
   *
   * @param {Config} nodeConfig
   * @param {string} nodeConfigPath
   * @returns {Queue}
   */
  static createFromNodeConfig(nodeConfig, nodeConfigPath) {
    const config = nodeConfig.get(nodeConfigPath);
    return QueueFactory.createFromConfig(config);
  }

  /**
   * @param {Object} config - refer to kue documentation for options
   * @returns {Queue}
   */
  static createFromConfig(config) {
    return Kue.createQueue(config);
  }

}

module.exports = QueueFactory;