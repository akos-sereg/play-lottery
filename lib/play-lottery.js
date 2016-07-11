var chalk = require('chalk');
var moment = require('moment');
var columnify = require('columnify')
var numberStore = require('./lottery-number-store');

module.exports = {

	validTypes: [ 'hun-lottery-5', 'hun-lottery-6', 'hun-otp-car' ],

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
		console.log('Accept? [Y/n] or type comma separated numbers');

		process.stdin.resume();
  		process.stdin.setEncoding('utf8');
  		process.stdin.on('data', function (userInput) {
		    
		    if (userInput === '\n' || userInput == 'Y\n') {
		    	numberStore.saveNumbers(type, randomNumbers);
		    	console.log('Numbers have been stored.');
		    }
		    else {

		    	var numbers = userInput.replace(/\n/g, '').replace(/ /g, '').split(',');
		    	if (numbers.length == randomConfig.count) {
		    		for (var i=0; i!=numbers.length; i++) {
						numbers[i] = parseInt(numbers[i]);
		    		}

		    		numberStore.saveNumbers(type, numbers);
		    		console.log('Numbers have been stored.');
		    	}
		    	else {
					console.log('Exiting.');
		    	}
		    }

		    process.exit();
		});

	},

	checkResults: function(lottery, code) {

		// Check code
		var provider = this.getLotteryProvider(lottery);
		if (provider.requiresCode) {
			provider.checkCode(code);
			return;
		}

		// Check lottery numbers you played (last 30 days)
		var applicablePlayedNumbers = [];
		var mostRecentNumbers = this.getMostRecentNumbers();
		mostRecentNumbers.forEach(function(numbers) {

			if (provider.compatibleType != numbers.type) {
				return;
			}

			applicablePlayedNumbers.push(numbers);
		});

		provider.checkResults(applicablePlayedNumbers);

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
	},

	getLotteryProvider: function(lottery) {

		if (this.validTypes.indexOf(lottery) == -1) {
			throw new Error('Invalid lottery type');
		}

		return require('./lottery/' + lottery);
	},
}