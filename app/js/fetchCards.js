/*eslint no-console: ["error", { allow: ["warn", "log"] }] */

/* Fetch Cards
  *  Returns card from a post Request
  *
*/

function fetchCards() {

  getCards = require('./getCards');

  const apiResult = getCards(1);

  app.post('/users', function(req, res, next) {

    if (req.body.id) {
      console.log('will save ',req.body.id,' access = ',req.body.access);
    } else {
      console.log('return json to browser');
      const row = { test: 'one' };
      return res.end(JSON.stringify(row));
    }
  });

}

module.exports = fetchCards;
