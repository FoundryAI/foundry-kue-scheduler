'use strict';

const Should = require('should');
const NodeConfig = require('config');
const Kue = require('kue-scheduler');
const LoggerFactory = require('hapiest-logger/lib/loggerFactory');
const logger = LoggerFactory.createLogger({
  enabled: true,
  consoleTransport: {enabled: true, level: 'info'},
  logglyTransport: {enabled: false}
});
const JobCreationServiceFactory = require('../../lib/creation/jobCreationServiceFactory');
const JobProcessingServiceFactory = require('../../lib/processing/jobProcessingServiceFactory');

/** @type {JobCreationService} */
var creationService;
/** @type {JobProcessingService} */
var processingService;
/** @type {Queue} */
var queue;

// Note, make sure to use different job names each test case or something goes haywire...has to do with the Kue singleton but haven't figured it out

describe('JobProcessingFactory', function() {

  before(() => {
    // kue.createFromConfig leverages a singleton underneath the hood
    // To test creating Queue's with different settings, we need to null out the singleton to allow re-create
    Kue.singleton = null;

    creationService = JobCreationServiceFactory.createFromNodeConfig(NodeConfig, 'queue', logger);
    processingService = JobProcessingServiceFactory.createFromNodeConfig(NodeConfig, 'queue', logger);
  });

  describe('registerJobProcessor', function() {

    it('Should process two email jobs and four ping jobs', function() {
      const emailJobsProcessed = [];
      const pingJobsProcessed = [];
      return Promise.resolve()
      .then(() => creationService.createJob('email', {email: 'john.doe@gmail.com', body:'Hello, world!'}, {priority: 'high', ttlInMs: 1000}))
      .then(() => creationService.createJob('email', {email: 'jane.doe@gmail.com', body:'Oh no!'}, {ttlInMs: 1000}))
      .then(() => creationService.createJob('ping', {ip: '127.0.0.1'}, {ttlInMs: 1000}))
      .then(() => creationService.createJob('ping', {ip: '127.0.0.2'}, {ttlInMs: 1000, priority: 'low'}))
      .then(() => creationService.createJob('ping', {ip: '127.0.0.3'}, {ttlInMs: 1000, priority: 'low'}))
      .then(() => creationService.createJob('ping', {ip: '127.0.0.4'}, {ttlInMs: 1000}))
      .then(() => {
        processingService.registerJobProcessor('email', (jobId, data) => {
          emailJobsProcessed.push({
            jobId: jobId,
            data: data
          });
          return Promise.resolve(true);
        }, 1);

        processingService.registerJobProcessor('ping', (jobId, data) => {
          pingJobsProcessed.push({
            jobId: jobId,
            data: data
          });
          return Promise.resolve(true);
        }, 4);
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(), 1000); // Give it 1 second to process stuff)
        });
      })
      .then(() => {
        emailJobsProcessed.length.should.eql(2);
        emailJobsProcessed[0].jobId.should.be.lessThan(emailJobsProcessed[1].jobId);
        emailJobsProcessed[0].data.email.should.eql('john.doe@gmail.com');
        emailJobsProcessed[0].data.body.should.eql('Hello, world!');
        emailJobsProcessed[1].data.email.should.eql('jane.doe@gmail.com');
        emailJobsProcessed[1].data.body.should.eql('Oh no!');

        pingJobsProcessed.length.should.eql(4);
        pingJobsProcessed[0].data.ip.should.eql('127.0.0.1');
        pingJobsProcessed[1].data.ip.should.eql('127.0.0.4');
        pingJobsProcessed[2].data.ip.should.eql('127.0.0.2');
        pingJobsProcessed[3].data.ip.should.eql('127.0.0.3');
      })
    })

  });

  describe('registerJobProcessorObject', function() {

    it('Should process two email jobs and four ping jobs', function() {
      const emailJobsProcessed = [];
      const pingJobsProcessed = [];
      let pingJobProcessor;
      return Promise.resolve()
      .then(() => creationService.createJob('email2', {email: 'john.doe@gmail.com', body:'Hello, world!'}, {priority: 'high', ttlInMs: 1000}))
      .then(() => creationService.createJob('email2', {email: 'jane.doe@gmail.com', body:'Oh no!'}, {ttlInMs: 1000}))
      .then(() => creationService.createJob('ping2', {ip: '127.0.0.1'}, {ttlInMs: 1000}))
      .then(() => creationService.createJob('ping2', {ip: '127.0.0.2'}, {ttlInMs: 1000, priority: 'low'}))
      .then(() => creationService.createJob('ping2', {ip: '127.0.0.3'}, {ttlInMs: 1000, priority: 'low'}))
      .then(() => creationService.createJob('ping2', {ip: '127.0.0.4'}, {ttlInMs: 1000}))
      .then(() => {
        const emailJobProcessor = {
          jobType: 'email2',
          process: function(jobId, data){
            emailJobsProcessed.push({
              jobId: jobId,
              data: data
            });
            return Promise.resolve(true);
          }
        };
        processingService.registerJobProcessorObject(emailJobProcessor);

        pingJobProcessor = {
          jobType: 'ping2',
          process: function(jobId, data){
            pingJobsProcessed.push({
              jobId: jobId,
              data: data
            });
            this.checkingBind = 'checked';
            return Promise.resolve(true);
          },
          concurrency: 4
        };
        processingService.registerJobProcessorObject(pingJobProcessor);
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(), 1000); // Give it 1 second to process stuff)
        });
      })
      .then(() => {
        emailJobsProcessed.length.should.eql(2);
        emailJobsProcessed[0].jobId.should.be.lessThan(emailJobsProcessed[1].jobId);
        emailJobsProcessed[0].data.email.should.eql('john.doe@gmail.com');
        emailJobsProcessed[0].data.body.should.eql('Hello, world!');
        emailJobsProcessed[1].data.email.should.eql('jane.doe@gmail.com');
        emailJobsProcessed[1].data.body.should.eql('Oh no!');

        pingJobsProcessed.length.should.eql(4);
        pingJobsProcessed[0].data.ip.should.eql('127.0.0.1');
        pingJobsProcessed[1].data.ip.should.eql('127.0.0.4');
        pingJobsProcessed[2].data.ip.should.eql('127.0.0.2');
        pingJobsProcessed[3].data.ip.should.eql('127.0.0.3');

        pingJobProcessor.should.have.property('checkingBind');
        pingJobProcessor.checkingBind.should.eql('checked');
      })
    })

  });

});