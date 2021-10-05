const amqp = require('amqplib/callback_api');
const amqp2 = require('amqplib');
const { RABBITMQ_SERVER } = require('../../.env');
const CONN_URL = `amqp://${RABBITMQ_SERVER}:5672`;

let ch = null;

module.exports = app => {
  /**
   * Check na conexao
   * @function
   * @name sendMessageToQueue
   * @return {String} Uma string com tipo de arquivo
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 02/09/2021
   */

  const sendMessageToQueue = (message, queueName) => {
    amqp.connect(CONN_URL, (errConn, connection) => {
      if (errConn) {
        throw new Error('Erro de conexao com servidor RabbitMQ');
      }
      connection.createChannel((errCh, channel) => {
        if (errCh) {
          throw errCh;
        }
        amqp.connect(CONN_URL, (error1, connection) => {
          console.log('MESSAGE: ', message, queueName);
          channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true,
          });
          if (error1) {
            throw new Error('Erro ao enviar a mensagem');
          }
        });
      });
    });
  };

  const sendMessageToQueue2 = async (message, queueName) => {
    let resultMessage = { status: 200, message: 'Mensagem enviada!' };
    await amqp2
      .connect(CONN_URL)
      .then(connection => {
        return connection.createChannel();
      })
      .then(channel => {
        console.log('MESSAGE: ', message, queueName);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
          persistent: true,
        });
        console.log('MESSAGE: ', message, queueName);
      })
      .catch(err => {
        resultMessage = {
          status: 503,
          message: 'Erro de conexao com servidor RabbitMQ!',
        };
      });
    return resultMessage;
  };

  return { sendMessageToQueue, sendMessageToQueue2 };
};
