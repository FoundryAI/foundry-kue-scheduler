## Purpose

foundry-kue-scheduler provides a light-weight wrapper around [kue](https://www.npmjs.com/package/kue) designed with engineering best practices in mind.
You must explicitly request permission to create jobs or process jobs separately (as opposed to having direct access to Queue which lets you do both).
It works with [Node config](https://www.npmjs.com/package/config) out of the box giving you flexibility to configure your Redis connection.
It only returns a job after it's successfully created and uses a Promise interface using [Bluebird](http://bluebirdjs.com/docs/getting-started.html) Promise implementation.
You can schedule jobs with an 'every' config param set, which mimics a cron interval scheduling string. [Info](https://crontab.guru/).


## Setup

0. Install Docker! https://docs.docker.com/engine/installation/

1. Build the docker image

```npm run docker:build```

2. If you're using an IDE, I recommend setting NODE_CONFIG_DIR to src/config.

3. If you want to run tests on your local machine instead of Docker, you should create src/config/default.json with Redis connection locally:

```
{
  "queue": {
    "redis": {
      "host": "192.168.99.100",
      "port": "6379",
      "db": 5
    }
  }
}
```

4. Run docker-compose up

## Running tests

The official tests should be run using
```npm test```