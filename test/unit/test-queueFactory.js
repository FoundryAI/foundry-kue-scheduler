'use strict';

const Should = require('should');
const Path = require('path');
const Kue = require('kue-scheduler');
const NodeConfigUncached = require('config-uncached');
const QueueFactory = require('../../lib/queueFactory');

describe('QueueFactory', function() {

  beforeEach(() => {
    // kue.createFromConfig leverages a singleton underneath the hood
    // To test creating Queue's with different settings, we need to null out the singleton to allow re-create
    Kue.singleton = null;
  });

  describe('createFromConfig', function() {

    it('Should create a basic Kue Queue that connects to redis on 192.168.99.100:6379', function() {

      const NodeConfig = NodeConfigUncached();
      console.log('Test 1');
      console.log(NodeConfig.util.getConfigSources());

      const config = {
        redis: {
          port: NodeConfig.get('queue.redis.port'),
          host: NodeConfig.get('queue.redis.host'),
          db: NodeConfig.get('queue.redis.db')
        }
      };

      const queue = QueueFactory.createFromConfig(config);

      Should.exist(queue);
      queue.should.have.property('create');
      queue.create.should.be.a.Function();
      queue.should.have.property('process');
      queue.process.should.be.a.Function();
      queue.should.have.property('client');
      queue.client.should.have.property('address');
      queue.client.address.should.eql(`${config.redis.host}:${config.redis.port}`);
    })

  });

  describe('createFromNodeConfig', function() {

    it('Should create a basic Kue Queue that connects to redis on 192.168.99.100:6379', function() {

      const nodeConfig = getNodeConfig('config-1');
      console.log('Test 2');
      console.log(JSON.parse(JSON.stringify(nodeConfig.get('someQueueConfig'))));
      console.log(nodeConfig.util.getConfigSources());
      const queue = QueueFactory.createFromNodeConfig(nodeConfig, 'someQueueConfig');

      Should.exist(queue);
      queue.should.have.property('create');
      queue.create.should.be.a.Function();
      queue.should.have.property('process');
      queue.process.should.be.a.Function();
      queue.should.have.property('client');
      queue.client.should.have.property('address');
      queue.client.address.should.eql('192.168.99.100:6379');
    })

  });

});

function getNodeConfig(configFolder) {
  const configDir = Path.join(__dirname, '../unit-helper/queueFactory', configFolder);
  process.env.NODE_CONFIG_DIR = configDir;
  return NodeConfigUncached(true);
}