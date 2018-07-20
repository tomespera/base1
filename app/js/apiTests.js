/*eslint no-console: ["error", { allow: ["warn", "log"] }] */
// highspont_mtg api tests
getCards = require('./getCards');

const apiResult = getCards(1);
apiResult.then(function(result) {
  const cardInfo = result;
  return cardInfo;
}, function(err) {
  console.log(err);
}).then(function(result) {
  // Print the code activity
  console.log(' Card dump', result);
});
