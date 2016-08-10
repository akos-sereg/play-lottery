var request = require('sync-request');
var chalk = require('chalk');

module.exports = {

    requiresCode: true,

    checkCode: function(code) {

        var resultsUrl = 'https://www.otpbank.hu/portal/hu/Megtakaritas/ForintBetetek/Gepkocsinyeremeny';
        var res = request('GET', resultsUrl);
        var body = res.body.toString('utf-8');

        var results = body.match(/[0-9]{2}\ [0-9]{7}/g);
        if (results.length == 0) {
            console.log('Can not parse input, seems like winning numbers are not present on website.');
        }

        console.log('Evaluating winning codes for ' + code);

        var resultMessage = '';
        for (var i=0; i!=results.length; i++) {
            if (code == results[i]) {
                resultMessage += chalk.green(results[i]) + ' <-- winning :) ';
            }
            else {
                resultMessage += chalk.red(results[i]);
            }

            if (i < results.length-1) {
                resultMessage += ', ';
            }
        }

        console.log(resultMessage);
    }
}