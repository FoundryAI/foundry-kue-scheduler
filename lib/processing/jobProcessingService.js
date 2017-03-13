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
      .then(() => this._logger.info('Job starting', {jobId: job.id, data: job.data}))
      .then(() => processFunction(job.id, job.data))
      .then(result => {
        this._logger.info('Job completed', {jobId: job.id, result: result, data: job.data});
        done(null, result);
      })
      .catch(err => {
        this._logger.error('Job failed', {jobId: job.id, data: job.data, err:err});
        done(err);
      })
    })
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
