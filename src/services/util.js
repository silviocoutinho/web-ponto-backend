const net = require('net');
const Promise = require('bluebird');

module.exports = app => {
  /**
   * Check na conexao
   * @function
   * @name checkConnection
   * @return {String} Uma string com tipo de arquivo
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 02/09/2021
   */

  function checkConnection(host, port, timeout) {
    return new Promise(function (resolve, reject) {
      timeout = timeout || 10000; // default of 10 seconds
      var timer = setTimeout(function () {
        reject('timeout');
        socket.end();
      }, timeout);
      var socket = net.createConnection(port, host, function () {
        clearTimeout(timer);
        resolve();
        socket.end();
      });
      socket.on('error', function (err) {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  return { checkConnection };
};
