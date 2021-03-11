'use strict';
const { check } = require('express-validator')
const Agent = require('../models').Agent;
const { Op } = require("sequelize");

module.exports = {
	createAgent() {
		return [
			check('email').exists().isEmail()
				.custom(value => {
				    return Agent.findOne({where: { email: value }}).then(user => {
					    if (user) {
					        return Promise.reject('E-mail already in use');
					    }
				    });
				}),
			check('password').exists(),
			check('username').exists(),
			check('phone').exists(),
			check('agent_code').exists().custom(value => {
				return Agent.findOne({where: { agent_code: value }}).then(user => {
				    if (user) {
				        return Promise.reject('Agent Code already in use');
				    }
			    });
			}),
			check('norek').exists(),
			check('bank_name').exists(),
		];
	},

	updateAgent() {
		return [
			check('email').exists().isEmail()
				.custom( (value, { req, location, path } ) => {
				    return Agent.findOne({
				    	where: { 
				    		agent_code: {[Op.ne]: req.params.code},
				    		email: value,
				    	}
				    }).then(user => {
					    if (user) {
					        return Promise.reject('E-mail already in use');
					    }
				    });
				}),
			check('username').exists(),
			check('phone').exists(),
			check('norek').exists(),
			check('bank_name').exists(),
		];
	},

	createAgentByParent() {
		return [
			check('parent_id').exists().custom(value => {
				return Agent.findByPk(value).then(user => {
					if (!user) {
			        return Promise.reject('Parent agent not found');
			    	}	
				});
			}),
			check('email').exists().isEmail()
				.custom(value => {
				    return Agent.findOne({where: { email: value }}).then(user => {
					    if (user) {
					        return Promise.reject('E-mail already in use');
					    }
				    });
				}),
			check('password').exists(),
			check('username').exists(),
			check('phone').exists(),
			check('agent_code').exists().custom(value => {
				return Agent.findOne({where: { agent_code: value }}).then(user => {
				    if (user) {
				        return Promise.reject('Agent Code already in use');
				    }
			    });
			}),
			check('norek').exists(),
			check('bank_name').exists(),
		];
	},
}