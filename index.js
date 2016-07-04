var playLottery = require('./lib/play-lottery.js');
var argv = require('minimist')(process.argv.slice(2));

if (argv.generate) {
	playLottery.generate(argv.generate);
}
else if (argv.list) {
	playLottery.list();
}
else if (argv.checkresults) {
	playLottery.checkResults(argv.checkresults);
}
else {
	playLottery.printHelp();
}

