var request = require('sync-request');
var chalk = require('chalk');

module.exports = {

    requiresCode: true,

    checkCode: function(code) {

        var res = request('GET', 'https://www.otpbank.hu/portal/hu/Megtakaritas/ForintBetetek/Gepkocsinyeremeny');
        var body = res.body.toString('utf-8');

        if (body.indexOf(code) != -1) {
                console.log('OTP Car Lottery winning: ' + chalk.green(code));
        }
        else {
                console.log('OTP Car Lottery not winning: ' + chalk.red(code));       
        }
    }

}