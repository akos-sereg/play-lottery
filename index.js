var playLottery = require('./lib/play-lottery.js');
var argv = require('minimist')(process.argv.slice(2));

if (argv.generate) {
	// Generate random numbers, or let user decide lottery numbers
	playLottery.generate(argv.generate);
}
else if (argv.list) {
	// List stored numbers
	playLottery.list();
}
else if (argv.checkresults) {
	// Check latest lottery numbers
	playLottery.checkResults(argv.checkresults);
}
else {
	// Help screen
	playLottery.printHelp();
}

