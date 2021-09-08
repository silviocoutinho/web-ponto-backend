const amqp = require('amqplib/callback_api');
const CONN_URL = 'amqp://localhost:5672';
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
        throw new Error('Erro de conexao ');
      }
      connection.createChannel((errCh, channel) => {
        if (errCh) {
          throw errCh;
        }
        amqp.connect('amqp://localhost:5672', (error1, connection) => {
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

  return { sendMessageToQueue };
};
