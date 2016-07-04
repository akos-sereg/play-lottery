var chalk = require('chalk');
var moment = require('moment');
var columnify = require('columnify')
var numberStore = require('./lottery-number-store');
var checkResults = require('./check-results');

module.exports = {

	generate: function(type) {

		if (type != 5 && type != 6) {
			console.log('Invalid type: ' + type + ' for command "--generate"');
			printHelp();
			return;
		}

		var randomConfig = this.getRandomNumberConfig(type);
		var randomNumbers = this.getRandomNumbers(randomConfig);

		console.log('Numbers: ' + chalk.green(randomNumbers.join(', ')));
		console.log('Do you accept these numbers? If you choose [Y], numbers will be saved, and you will be able to');
		console.log('check them against actual results');
		console.log('Accept? [Y/n] ');

		process.stdin.resume();
  		process.stdin.setEncoding('utf8');
  		process.stdin.on('data', function (userInput) {
		    
		    if (userInput === '\n' || userInput == 'Y\n') {
		    	numberStore.saveNumbers(type, randomNumbers);
		    	console.log('Numbers have been stored.');
		    }
		    else {
		    	console.log('Exiting.');
		    }

		    process.exit();
		});

	},

	checkResults: function(lottery) {

		// Latest lottery results
		var results = checkResults.getResults(lottery);
		console.log('Latest lottery results ('+lottery+'): ' + results.join(', '));

		// Lottery numbers you played (last 30 days)
		var mostRecentNumbers = this.getMostRecentNumbers();
		mostRecentNumbers.forEach(function(numbers) {

			if (!checkResults.isCompatible(lottery, numbers.type)) {
				return;
			}

			var line = 'Generated and stored at ' + numbers.date + ' - ';
			for (var i=0; i!=numbers.numbers.length; i++) {

				if (results.indexOf(numbers.numbers[i]) != -1) {
					line += chalk.green(numbers.numbers[i]);
				}
				else {
					line += chalk.red(numbers.numbers[i]);
				}

				if (i < numbers.numbers.length -1) {
					line += ', ';
				}
			}

			console.log(line);

		});
	},

	getMostRecentNumbers: function() {
		var entries = numberStore.load();
		var filtered = [];
		entries.forEach(function(entry) { 
			var diff = moment(new Date()).diff(Date.parse(entry.date), 'days');

			if (diff < 30) {
				filtered.push(entry);
			}
		});

		return filtered;
	},

	list: function() {
		console.log(columnify(this.getMostRecentNumbers(), { minWidth: 20 }));
	},

	printHelp: function() {

		var lineEnding = require('os').EOL;
		var help = lineEnding;
		help += 'Usage: play-lottery <command>' + lineEnding;
		help += '' + lineEnding;
		help += 'play-lottery --generate=<type>            Generates random numbers for lottery of type <type>, type can be: "5" or "6"' + lineEnding;
		help += 'play-lottery --list                       List stored lottery numbers (last 30 days)' + lineEnding;
		help += 'play-lottery --checkresults=<lottery>     Checks results of lottery (last week) against stored lottery numbers' + lineEnding;

		console.log(help);
	},

	getRandomNumbers: function(config) {

		var numbers = [];

		while(numbers.length != config.count) {
			var random = Math.floor(Math.random() * (config.max - config.min + 1) + config.min);

			if (numbers.indexOf(random) == -1) {
				numbers.push(random);
			}
		}

		return numbers;
	},

	getRandomNumberConfig: function(type) {
		switch(type) {
			case 5: 
				return { min: 1, max: 90, count: 5 };
				break;

			case 6: 
				return { min: 1, max: 45, count: 6 };
				break;

			default: 
				return null;
		}
	}
}