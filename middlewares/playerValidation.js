'use strict';
const { check } = require('express-validator')
const Agent = require('../models').Agent;
const { Op } = require("sequelize");

module.exports = {
	createPlayer() {
		return [
			check('agent_id').exists()
				.custom(value => {
				    return Agent.findByPk(value).then(user => {
					    if (!user) {
					        return Promise.reject('Agent not found');
					    }
				    });
				}),
			check('badge').exists().matches(/\b(?:gold|standart)\b/),
		];
	},

	updatePlayer() {
		return [
			check('badge').exists().matches(/\b(?:gold|standart)\b/),
		];
	},
}