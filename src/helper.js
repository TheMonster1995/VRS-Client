const cryptoJs = require('crypto-js');

const {
  clientSecret
} = require('./config.json');

module.exports = {
  /**
   * This function encrypts the given string using cryptoJS and an encryption phrase
   * @param  {String} string Input string
   * @return {String}        Encrypted string
   */
  encrypt: string => {
    return cryptoJs.AES.encrypt(string, clientSecret).toString();
  },

  decrypt: string => {
    return cryptoJs.AES.decrypt(string, clientSecret).toString(
      cryptoJs.enc.Utf8
    );
  },

  isDefined: obj => {
    if (typeof obj == "undefined") return false;

    if (!obj) return false;

    return obj != null;
  }
}
