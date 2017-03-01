'use strict';

const Should = require('should');
const NodeConfig = require('config');
const Job = require('kue-scheduler/lib/queue/job');
const LoggerFactory = require('hapiest-logger/lib/loggerFactory');
const logger = LoggerFactory.createLogger({
  enabled: true,
  consoleTransport: {enabled: true, level: 'info'},
  logglyTransport: {enabled: false}
});
const JobCreationServiceFactory = require('../../lib/creation/jobCreationServiceFactory');

/** @type {JobCreationService} */
var service;
/** @type {Queue} */
var queue;

describe('JobCreationService', function() {

  beforeEach(() => {
    service = JobCreationServiceFactory.createFromNodeConfig(NodeConfig, 'queue', logger);
  });

  describe('createJob', function() {

    it('Should create and return a job with no extra options provided', function() {
      return service.createJob('sendEmail', {email: 'john.doe@gmail.com', body: 'Hello, world!'})
      .then(job => {
        Should.exist(job);
        job.should.be.an.instanceOf(Job);
        job.should.have.property('id');
        job.id.should.be.a.Number();
        job._removeOnComplete.should.be.True();

        const jobObj = job.toJSON();
        jobObj.should.have.properties(['id','type','data']);
        jobObj.type.should.eql('sendEmail');
        jobObj.data.should.be.an.Object();
        jobObj.data.should.have.properties(['email','body']);
        jobObj.data.email.should.eql('john.doe@gmail.com');
        jobObj.data.body.should.eql('Hello, world!');
      })
    });

    it('Should create and return a job with all extra options provided', function() {
      const options = {
        priority: 'high',
        attempts: 5,
        backoff: true,
        ttlInMs: 10000,
        removeOnComplete: false
      };
      return service.createJob('sendEmail', {email: 'john.doe@gmail.com', body: 'Hello, world!'}, options)
      .then(job => {
        Should.exist(job);
        job.should.be.an.instanceOf(Job);
        job.should.have.property('id');
        job.id.should.be.a.Number();
        Should.not.exist(job._removeOnComplete);
        job.backoff().should.be.True();

        const jobObj = job.toJSON();
        jobObj.should.have.properties(['id','type','data','priority','attempts', 'ttl']);
        jobObj.type.should.eql('sendEmail');
        jobObj.data.should.be.an.Object();
        jobObj.data.should.have.properties(['email','body']);
        jobObj.data.email.should.eql('john.doe@gmail.com');
        jobObj.data.body.should.eql('Hello, world!');
        jobObj.priority.should.eql(-10);
        jobObj.attempts.max.should.eql(5);
        jobObj.ttl.should.eql(10000);
      })
    });

  });

});