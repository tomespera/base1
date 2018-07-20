// API test

//import chai, { expect, should } from 'chai';
const chai = require('chai');
const expect = chai.expect;
const getOneCardApi = require('../app/js/getOneCard');
const card = getOneCardApi(1); // Adorable Kitten
describe('Get card from MTG API', () => {

    it('Can get card Adorable Kitten', async () => {
      const result = await card;
      expect(result.cards[0].name).to.equal('Adorable Kitten');
    });
    /*
    This style is just as safe as the '.then(done,done)' style,
    but it's much easier to read since there is no chaining and nesting
    of then callbacks.
    */

});
