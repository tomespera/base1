/**
  * Get cards
  *
  * This method request a JSON object from MTG
  * It returns a promise with cards
  * Provides a caching mechanism for speed and filters out all unccessary data

*/

const request = require('request-caching');
const cache = new request.MemoryCache();
const type = 'creature';
// validFields are the only data being sent to the client - this improves bandwidth
const validFields = ['name','imageUrl','multiverseid','artist','setName','set'];
// retrieves cards from api where type is 'creature' and that cards include a imageID and multiverseID
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
    request(options.url, {cache: cache}, function(err, resp, body) {
      if (err) {
        reject(err);
      } else {
        // reduce payload being sent to client from 30k to 4k
        resolve(filterData(JSON.parse(body), validFields));
        //resolve(JSON.parse(body));
      }
    });
  });
}

/**
  * filterData
  *
  * Based on the current application requirements, only the following fields are needed
  * 'name','imageUrl','multiverseid','artist','setName','set'
  * We return only these fields to improve performance and lower page bandwith usage
*/
function filterData(json,validFields) {
  let filteredJson = { cards: [] };
  json.cards.forEach((el,i) => {
    const returnObject = selectOnly(el,validFields);
    filteredJson.cards[i] = returnObject;
  });
  return filteredJson;
}

/**
  * selectOnly
  *
  * Returns only objects that are in the fields array
  *
*/
function selectOnly(object, fields) {
  return fields.reduce(function(result, field) {
    result[field] = object[field];
    return result;
  }, {});
}


module.exports = getCards;
