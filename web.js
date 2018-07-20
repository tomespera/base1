
/**
 * Express web server
 *
 * Includes swig templating engine for future use
 * Mocha test runner for future use
 * FetchCard api for hooks for Heroku
 *
 */

const express = require('express');
http = require('http'),
path = require('path'),
app = express(),
swig = require('swig'),
bodyParser = require('body-parser'),
getCards = require('./app/js/getCards');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

swig.setDefaults({ cache: false });
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('view cache', false);
app.set('case sensitive routing', false);
app.set('docGranted', false);

if (app.get('env') === 'development') {
  var livereload = require('connect-livereload')();
  app.use(livereload);
} else {
  // heroku
  app.use('/app', express.static(path.join(__dirname, '/app')));
}

if (app.get('env') == 'development') {
  module.exports = app;
} else {
  http.createServer(app).listen(app.get('port'));
}

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/testrunner', function (req, res) {
  res.render('testrunner');
});

app.post('/fetchCard', function(req, res) {
  console.log('return json to browser',req.body);
  const apiResult = getCards(req.body.pageSize,req.body.page);
  apiResult.then(function(result) {
    const cards = result;
    return res.end(JSON.stringify(cards));
  }, function(err) {
    console.log(err);
  }).then(function(result) {
    // Print the code activity
    console.log(' Card dump', result);
  });
});

module.exports = app;
