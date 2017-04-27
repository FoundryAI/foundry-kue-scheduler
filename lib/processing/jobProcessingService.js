'use strict';

const Promise = require('bluebird');

class JobProcessingService {

  /**
   * @param {Queue} queue
   * @param {Logger} logger
   */
  constructor(queue, logger) {
    /** @type {Queue} */
    this._queue = queue;
    this._logger = logger;
  }

  /**
   * @name JobProcessingFunction
   * @type {Function}
   * @param {int} jobId
   * @param {Object} data
   * @returns {Promise.<*>}
   */

  /**
   * @param jobType
   * @param {JobProcessingFunction} processFunction - (jobId, data) => Promise.<result>
   * @param {int} [concurrency=1] - number of simultaneous jobs that can be running; defaults to 1
   */
  registerJobProcessor(jobType, processFunction, concurrency) {
    this._queue.process(jobType, concurrency || 1, (job, done) => {
      return Promise.resolve()
      .tap(() => this._logger.info(`job.start id:${job.id}`))
      .then(() => processFunction(job.id, job.data))
      .tap(() => this._logger.info(`job.finish id:${job.id}`))
      .then(result => done(null, result))
      .catch((err) => {
        this._logger.error(`job.fail id:${job.id}`);
        done(err);
      });
    });
  }

  /**
   * @name JobProcessor
   * @type Object
   * @property {string} jobType
   * @property {Function} process - (jobId, data) => Promise.<result>
   * @property {int} [concurrency=1]
   */

  /**
   * @param {JobProcessor} jobProcessor
   * @returns {Promise.<*>}
   */
  registerJobProcessorObject(jobProcessor) {
    return this.registerJobProcessor(jobProcessor.jobType, jobProcessor.process.bind(jobProcessor), jobProcessor.concurrency);
  }

  shutdown(timeout = 5000) {
    return new Promise((resolve, reject) => {
      this._queue.shutdown(5000, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

}

module.exports = JobProcessingService;
