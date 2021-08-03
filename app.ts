import { Application } from 'egg';
const amqp = require('amqplib/callback_api');

export default async (app: Application) => {
  const config = app.config.rabbitmq;
  //todo use Joi to check config attributes
  if (!config) {
    throw new Error('[egg-zing-rabbitmq] Config of Rabbitmq is needed.');
  }

  app.beforeStart(async () => {
    try {
      //@ts-ignore
      app.channel = await getChannel(config);
      //@ts-ignore
      if (app.channel) {
        app.logger.info('[egg-zing-rabbit] Successfully connected to the RabbitMQ, and init channel done.');
      }
    } catch (e) {
      app.logger.error('[egg-zing-rabbit] Error connecting to the RabbitMQ:', e);
    }
  })
}

function getChannel(_config) {
  return new Promise((resolve, reject) => {
    amqp.connect({
      protocol: _config.protocol,
      hostname: _config.hostname,
      port: _config.port,
      username: _config.username,
      password: _config.password,
      vhost: _config.vhost,
    }, function (error0, connection) {
      if (error0) {
        reject(error0);
      }
      connection.createChannel(function (error1, _channel) {
        if (error1) {
          reject(error1);
        }

        resolve(_channel);

      });
    });
  })
}