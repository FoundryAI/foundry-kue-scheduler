'use strict';

const Should = require('should');
const HapiestQueueFactory = require('../../lib/foundryKueFactory');
const JobCreationServiceFactory = require('../../lib/creation/jobCreationServiceFactory');
const JobProcessingServiceFactory = require('../../lib/processing/jobProcessingServiceFactory');
const QueueFactory = require('../../lib/queueFactory');

describe('HapiestQueueFactory', function() {

  describe('jobCreationServiceFactory', function() {

    it('Should return an instance of JobCreationServiceFactory', function() {
      const jobCreationServiceFactory = HapiestQueueFactory.jobCreationServiceFactory();
      Should.exist(jobCreationServiceFactory);
      jobCreationServiceFactory.name.should.eql('JobCreationServiceFactory');
      jobCreationServiceFactory.createFromNodeConfig.should.be.a.Function();
      jobCreationServiceFactory.createFromConfig.should.be.a.Function();
      jobCreationServiceFactory.create.should.be.a.Function();
    });

  });

  describe('jobProcessingServiceFactory', function() {

    it('Should return an instance of JobProcessingServiceFactory', function() {
      const jobProcessingServiceFactory = HapiestQueueFactory.jobProcessingServiceFactory();
      Should.exist(jobProcessingServiceFactory);
      jobProcessingServiceFactory.name.should.eql('JobProcessingServiceFactory');
      jobProcessingServiceFactory.createFromNodeConfig.should.be.a.Function();
      jobProcessingServiceFactory.createFromConfig.should.be.a.Function();
      jobProcessingServiceFactory.create.should.be.a.Function();
    });

  });

  describe('queueFactory', function() {

    it('Should return an instance of QueueFactory', function() {
      const queueFactory = HapiestQueueFactory.queueFactory();
      Should.exist(queueFactory);
      queueFactory.name.should.eql('QueueFactory');
      queueFactory.createFromNodeConfig.should.be.a.Function();
      queueFactory.createFromConfig.should.be.a.Function();
    });

  });

});