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
  },

  numberNormalizer: (val, min = 0) => {
    if (!val) return '';
    let value = parseFloat(val.toString().replace(/,/g, '')).toString();

    if (isNaN(value)) return '';

    if (parseFloat(value) < min) return min;

    if (value.length <= 3) return value;

    let numRegex = /[0-9]*/;
    let res = '';
    let i;
    let tempRes;

    if (value.indexOf('.') >= 0) {
      res = value.slice(value.indexOf('.'), value.indexOf('.') + 3);
      value = value.slice(0, value.indexOf('.'));
    }

    if (value.length <= 3) return `${value}${res}`;

    if (value.length % 3 > 0) {
      tempRes = value.slice(0, value.length % 3);
      value = value.slice(value.length % 3);
    } else {
      tempRes = value.slice(0, 3);
      value = value.slice(3);
    }

    let forCounter = parseInt(value.length / 3)

    for (i = 0; i < forCounter; i++) {
      tempRes = `${tempRes},${value.slice(0, 3)}`;
      value = value.slice(3);
    }

    return `${tempRes}${res}`;
  }
}
