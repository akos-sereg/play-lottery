var request = require('sync-request');
var cheerio = require('cheerio');
var chalk = require('chalk');
var moment = require('moment');

module.exports = {

	compatibleType: 5,
    requiresCode: false,
    winCount: 2,

    checkResults: function(playedNumbers) {

        var results = this.getResults();
        console.log('Latest lottery results (5-os lotto): ' + results.join(', '));

        playedNumbers.forEach(function(numbers) {

            var differenceInDays = moment(new Date()).diff(Date.parse(numbers.date), 'days');
            var line = 'Generated and stored '+differenceInDays+' days ago - ';
            
            var winCount = 0;
            for (var i=0; i!=numbers.numbers.length; i++) {

                if (results.indexOf(numbers.numbers[i]) != -1) {
                        line += chalk.green(numbers.numbers[i]);
                        winCount++;
                }
                else {
                        line += chalk.red(numbers.numbers[i]);
                }

                if (i < numbers.numbers.length -1) {
                        line += ', ';
                }
            }

            if (winCount >= this.winCount) {
                line += chalk.green(' <= yaay :)');
            }


            console.log(line);
        });
    },

	getResults: function() {

		var res = request('GET', 'https://bet.szerencsejatek.hu/jatekok/otoslotto/sorsolasok');
		var $ = cheerio.load(res.body.toString('utf-8'));

        var numbers = $('span[class="number selected unclickable"]');
        if (numbers == null || numbers.length != 5) {
            console.log('Numbers could not be found');
            return;
        }

        var results = [];

        for (var i=0; i!=numbers.length; i++) {
        	results[i] = parseInt(numbers[i].children[0].data);
        }

        return results;
	}

}