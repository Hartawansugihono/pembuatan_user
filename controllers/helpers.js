'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
	res(values, res, code = 200) {
		var data = {
			'status': code,
			'messages': values
		};
		res.json(data);
		res.end();
	},

	hashPassword(password) {
        return bcrypt.hashSync(password, 8);
    },

    comparePassword(pass, realPass) {
    	return bcrypt.compareSync(pass, realPass);
    },

    generateToken(secret, time = 86400) {
    	return 'Bearer ' + jwt.sign({ id: secret}, 'SECRET_KEY', {
			expiresIn: time //24h expired
		});
    },

    //random string 32 character
  	randomString(num = 32) {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for (var i = 0; i < num; i++)
	      text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
  	},
}