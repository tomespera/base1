/**
  * Get cards
  *
  * This method request a JSON object from MTG
  * It returns a promise with cards
  * Also provides a caching mechanism for speed
  * -- will add description for JSON
*/

const request = require('request');
const type = 'creature';
// retrivies cards from api where type is 'creature' and that cards include a imageID and multiverseID
const apiEndpoint = `https://api.magicthegathering.io/v1/cards?contains=imageUrl&types=${type}`;

function getCards(pageSize,page) {
  const options = {
    url: `${apiEndpoint}&pageSize=${pageSize}&page=${page}`,
    headers: {
      'User-Agent': 'request'
    }
  };
    // Return new promise
  return new Promise(function(resolve, reject) {
    request.get(options, function(err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

module.exports = getCards;
