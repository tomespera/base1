// Retrieves one MTG card
var request = require('request');
const apiEndpoint = 'https://api.magicthegathering.io/v1/cards?pageSize=1&page=';

function getOneCard(cardId) {
  var options = {
    url: apiEndpoint + cardId,
    headers: {
      'User-Agent': 'request'
    }
  };
    // Return new promise
  return new Promise(function(resolve, reject) {
    // Do async job
    request.get(options, function(err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

module.exports = getOneCard;
