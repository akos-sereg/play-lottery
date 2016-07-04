module.exports = {

	validTypes: [ 'hun-lottery-5', 'hun-lottery-6' ],

	getResults: function(lottery) {

		if (this.validTypes.indexOf(lottery) == -1) {
			throw new Error('Invalid lottery type');
		}

		return require('./lottery/' + lottery).getResults();
	},

	isCompatible: function(lottery, type) {
		return require('./lottery/' + lottery).compatibleType == type;
	}

}