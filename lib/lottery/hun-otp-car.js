var request = require('sync-request');
var chalk = require('chalk');

module.exports = {

    requiresCode: true,

    checkCode: function(code) {

        var resultsUrl = 'https://www.otpbank.hu/portal/hu/Megtakaritas/ForintBetetek/Gepkocsinyeremeny';
        var res = request('GET', resultsUrl);
        var body = res.body.toString('utf-8');

        var results = body.match(/[0-9]{2}[\ \n\t]{1}[0-9]{7}/g);
        if (results == null || results.length == 0) {
            console.log('Can not parse input, seems like winning numbers are not present on website.');
            return;
        }

        console.log('Evaluating winning codes for ' + code);

        var resultMessage = '';
        for (var i=0; i!=results.length; i++) {
            
            var parsedCode = results[i].replace("\n", ' ').replace("\t", ' ');

            if (code == parsedCode) {
                resultMessage += chalk.green(parsedCode) + ' <-- winning :) ';
            }
            else {
                resultMessage += chalk.red(parsedCode);
            }

            if (i < results.length-1) {
                resultMessage += ', ';
            }
        }

        console.log(resultMessage);
    }
}