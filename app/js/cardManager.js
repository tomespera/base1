
/**
 * Card Manager
 *
 * Responsible for rending MTG cards unto the page
 *
 * Loads first 20 cards on page load
 * Setsup a listener for window scroll and attempts to load 20 more cards
 * If page exceed 200 cards or no more cards are availabe from api
 * Message will be displayed
 *
 */

const apiParams = {}; // use to pass parameters into api
apiParams.pageSize = 20; // number of cards per page
apiParams.page = 1; // starting page - last working page 810
const windowHeightOffset = 0; // load slighly before end of scroll
const maxiumCardsToDisplay = 200;
let numberOfCardsOnPage = 0;
let noMoreCardsFromApi = false;
let fetchingCards = false;
const footer = {}; // Footer messages
footer.loading = 'Loading Cards..';
footer.maximumReached = 'Maximum '+maxiumCardsToDisplay+' cards reached.';
footer.endOfList = 'End of list - No more cards available from API'
const metaButton = {};
metaButton.show = "Show details";
metaButton.hide = "Hide details";
// Loads first set when page loads
$( document ).ready(function() {
  fetchCards(apiParams);
  // Enable display of metadata and toggling - this was a requirement but I think the page looks better without it
  // Perhaps some css love would do the trick :)
  toggleMetadata();
});

/**
 * On window scroll listener
 *
 * Assigns a listener for bottom of window scroll and attempts to load 20 more cards
 * If page exceed 200 cards or no more cards are availabe from api
 * function returns and message displayed in the footer
 *
 */
window.onscroll = function () {
  if (getScrollTop() < getDocumentHeight() - window.innerHeight - windowHeightOffset) return;
  if (fetchingCards || noMoreCardsFromApi) return;
  if (numberOfCardsOnPage + apiParams.pageSize < maxiumCardsToDisplay) {
    numberOfCardsOnPage += apiParams.pageSize;
  } else {
    footerMessage(footer.maximumReached);
    return;
  }
  apiParams.page++;
  console.log('loading new data..',apiParams.page);
  footerMessage(footer.loading);
  fetchingCards = true;
  fetchCards(apiParams);
};

function getScrollTop() {
  return window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

function getDocumentHeight() {
  var body = document.body;
  var html = document.documentElement;
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

/**
 * FetchCards
 *
 * Requests a set of cards from the local proxy API
 * The idea is to limit xdomain calls and receive only data needed for the page
 * to reduce bandwith usage and perhaps cache results
 *
 */
function fetchCards(apiParams) {
  $.post( '/fetchCard', apiParams )
    .done(function( json ) {
      renderCards(JSON.parse(json));
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ', ' + error;
      console.log( 'Request Failed: ' + err );
    });
}

/**
 * renderCards
 *
 * Iterrates through cards received from api and calls the renderOneCard method
 * If the cards object is empty set the noMOreCardsFromApi flag
 *
 */
function renderCards(json) {
  if (json.cards.length < 1) {
    footerMessage(footer.endOfList);
    noMoreCardsFromApi = true;
    return;
  }
  $('.footer').fadeOut();
  window.theCards = json.cards;
  for (card of json.cards) {
    renderOneCard(card);
  }
  fetchingCards = false;
}
/**
 * renderOneCard
 *
 * 1. Extracts meta data from card and checks for missing imageUrl or multiverseId
 * 2. Copies HTML template and appends it to the cards container
 * 3. Assigns a link to a hi-res card image
 * 4. Adds metadata such as card name, image, artist name, and set name as image title attribute
 *    (originally wanted to print this meta data on the screen but this degrades the UI)
 */
function renderOneCard(card) {
  const name = card.name;
  const image = card.imageUrl;
  if (image && image.length < 1) {
    console.log('ERROR no image!!! ',card);
    return;
  }
  const multiverseId = card.multiverseid;
  if (!multiverseId) {
    console.log(name,' no multiverse id!');
    return;
  }
  const artist = card.artist;
  const setName = card.setName;
  const set = card.set;
  const lb = '&#13;';
  const title = 'Name: '+name+lb+'Artist: '+artist+lb+'Set: '+setName;

  // in future open in modal window -- set param does not work for all cards ex: 7ED deskmaster dropps D
  const largeCardImage = 'https://deckmaster.info/images/cards/'+set+'/'+multiverseId.toString()+'-hr.jpg';
  // copy template
  $('.cardContainerTemplate' ).clone()
    .appendTo( '.cards' )
    .addClass(multiverseId.toString())
    .removeClass('cardContainerTemplate')
    .addClass('cardContainer');
  $('.' + multiverseId + ' .cardImage').html('<a href="'+largeCardImage+'" target="_blank"><img src="'+image+'" title="'+title+'"/></a>');
  $('.' + multiverseId + ' .name').text(name);
  $('.' + multiverseId + ' .artist').text(artist);
  $('.' + multiverseId + ' .set').text(set);
  $('.' + multiverseId).show();
}
/**
   * footerMessage
   *
   *  Prints status messages in the footer suchs as loading and maximum reached
   */
function footerMessage(message) {
  console.log('printing footer ',message);
  $('.footer').text(message);
  $('.footer').fadeIn();
}

function toggleMetadata() {
  $('.metaToggle').show();
  $('.meta').show();
  $('#metaToggleButton').html(metaButton.hide);
  $('#metaToggleButton').click( function() {
    if ($(this).hasClass('Hide')) {
      $(this).removeClass('Hide');
      $(this).html(metaButton.show);
      $('.meta').hide();
    } else {
      $(this).addClass('Hide');
      $(this).html(metaButton.hide);
      $('.meta').show();
    }
    //$(this).html('Hide card metadata');
  });
}
