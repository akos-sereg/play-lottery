var fs = require('fs');

module.exports = {

	entries: [],
	filename: 'numbers.dat',

	saveNumbers: function(type, numbers) {
		this.load();
		this.entries.push({ 
			type: type, 
			numbers: numbers,
			date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
		});
		this.save();
	},

	save: function() {
		fs.writeFileSync(this.filename, JSON.stringify(this.entries));
	},

	load: function() {

	    try
	    {
	        fs.statSync(this.filename).isFile();
	    }
	    catch (err)
	    {
	        return this.entries;
	    }

    	this.entries = JSON.parse(fs.readFileSync(this.filename));
    	return this.entries;
	},
}