var request = require('sync-request');
var cheerio = require('cheerio');

module.exports = {

        compatibleType: 6,

        getResults: function() {

                var res = request('GET', 'http://www.szerencsejatek.hu/hatoslotto');
                var $ = cheerio.load(res.body.toString('utf-8'));
                var text = $('ul[class="nums"]').text();

                var results = text.trim().replace(/\t/g, '').split('\n');
        
                for (var i=0; i!=results.length; i++) {
                        results[i] = parseInt(results[i]);
                }

                return results;
        }

}