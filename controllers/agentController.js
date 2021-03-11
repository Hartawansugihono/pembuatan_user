const Agent = require('../models').Agent;
const helper = require('./helpers');
const redis = require('redis');
const client = redis.createClient();
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');

module.exports = {
	insert(req, res) {
		try {
			const errors = validationResult(req);
	        if (!errors.isEmpty()) {
	            return res.status(400).json({
	                errors: errors.array()
	            });
	        }

	        return Agent.create({
				username	: 	req.body.username,
				password	: 	helper.hashPassword(req.body.password),
				phone		: 	req.body.phone,
				norek		: 	req.body.norek,
				bank_name	: 	req.body.bank_name,
				role		: 	'master',
				email		: 	req.body.email,
				agent_code	: 	req.body.agent_code
			}).then(success => {
				helper.res('create agent success', res);
			}).catch(error => {
				helper.res(error, res, 400);
			});
		} catch(error) {
			helper.res(error, res, 400);
			return;
		}
	},

	insertByParent(req, res) {
		try {
			const errors = validationResult(req);
	        if (!errors.isEmpty()) {
	            return res.status(400).json({
	                errors: errors.array()
	            });
	        }

	        return Agent.create({
				username	: 	req.body.username,
				password	: 	helper.hashPassword(req.body.password),
				phone		: 	req.body.phone,
				norek		: 	req.body.norek,
				bank_name	: 	req.body.bank_name,
				role		: 	'agent',
				email		: 	req.body.email,
				agent_code	: 	req.body.agent_code,
				parent_id	: 	req.params.parent_id
			}).then(success => {
				helper.res('create agent success', res);
			}).catch(error => {
				helper.res(error, res, 400);
			});
		} catch(error) {
			helper.res(error, res, 400);
			return;
		}
	},

	all(req, res) {
		const redisKey = 'agent-all';
		try {
			client.get(redisKey,(err,data) => {
				if(data) {
					return helper.res(JSON.parse(data), res, 200);
				}
				else {
					const agents = Agent.findAll().then( data => {
						client.set(redisKey,JSON.stringify(data),'EX',60);
						return helper.res(data, res);
					})
					.catch((errs) => {
		        		return helper.res(errs, res, 400);
		        	});
				}
			});
		} catch (err) {
			return helper.res(err, res, 400);
		}
	},

	allAgent(req, res) {
		const redisKey = 'agent-all-agent';
		try {
			client.get(redisKey,(err,data) => {
				if(data) {
					return helper.res(JSON.parse(data), res, 200);
				}
				else {
					const agents = Agent.findAll({ 
						where: {parent_id: {[Op.ne]: null} },
						include: [{model: Agent, as: 'agent_agent'}]
					})
					.then( data => {
						client.set(redisKey,JSON.stringify(data),'EX',60);
						return helper.res(data, res);
					})
					.catch((errs) => {
		        		return helper.res(errs, res, 400);
		        	});
				}
			});
		} catch (err) {
			return helper.res(err, res, 400);
		}
	},

	getByCode(req, res) {
		const redisKey = 'agent-get-' + req.params.code;
		try {
			client.get(redisKey,(err,data) => {
				if(data) {
					return helper.res(JSON.parse(data), res, 200);
				}
				else {
					const players = Agent.findOne({ where: { agent_code: req.params.code } })
		        	.then(data => {
		        		client.set(redisKey,JSON.stringify(data),'EX',60); 
		        		return helper.res(data, res);
		        	})
		        	.catch((errs) => {
		        		return helper.res('Agent not found', res, 400);
		        	});
				}
			});
		} catch (err) {
			return helper.res(err, res, 400);
		}
	},

	getAgentByCode(req, res) {
		const redisKey = 'agent-get-agent-' + req.params.code;
		try {
			client.get(redisKey,(err,data) => {
				if(data) {
					return helper.res(JSON.parse(data), res, 200);
				}
				else {
					const players = Agent.findOne({ where: { agent_code: req.params.code }, include: [{model: Agent, as: 'agent_agent'}] })
		        	.then(data => {
		        		client.set(redisKey,JSON.stringify(data),'EX',60); 
		        		return helper.res(data, res);
		        	})
		        	.catch((errs) => {
		        		return helper.res('Agent not found', res, 400);
		        	});
				}
			});
		} catch (err) {
			return helper.res(err, res, 400);
		}
	},

	update(req, res) {
		try {
			const errors = validationResult(req);
	        if (!errors.isEmpty()) {
	            return res.status(400).json({
	                errors: errors.array()
	            });
	        }

	        return Agent.findOne({ where: { agent_code: req.params.code } })
	        .then(user => {
	        	user.update({
					username	: 	req.body.username || user.username,
					phone		: 	req.body.phone || user.phone,
					norek		: 	req.body.norek || user.norek,
					bank_name	: 	req.body.bank_name || user.bank_name,
					email		: 	req.body.email || user.email,
				}).then(success => {
					helper.res('update agent success', res);
				}).catch(error => {
					helper.res(error, res, 400);
				});
	        }).catch(err => {
	        	helper.res(err, res, 401);
	        });
	        
		} catch(error) {
			helper.res(error, res, 500);
			return;
		}
	},

	updates(req, res) {
		try {
			const errors = validationResult(req);
	        if (!errors.isEmpty()) {
	            return res.status(400).json({
	                errors: errors.array()
	            });
	        }

	        return Agent.findAll({ where: { parent_id: req.params.id } })
	        .then(users => {
	        	users.forEach((user, index) => {
	        		user.update({
						username	: 	req.body.username || user.username,
						phone		: 	req.body.phone || user.phone,
						norek		: 	req.body.norek || user.norek,
						bank_name	: 	req.body.bank_name || user.bank_name,
						email		: 	req.body.email || user.email,
					}).then(success => {
						helper.res('update agent success', res);
					}).catch(error => {
						helper.res(error, res, 400);
					});	
	        	});
	        	
	        }).catch(err => {
	        	helper.res(err, res, 401);
	        });
	        
		} catch(error) {
			helper.res(error, res, 500);
			return;
		}
	},

	delete(req, res) {
		return Agent.findOne({ where: { agent_code: req.params.code } })
		.then(user => {
			if(!user) helper.res('Agent Not Found', res, 400);
			
			return user.destroy()
			.then( () => helper.res('Success remove agent', res, 204) )
			.catch((err) => helper.res(err, res, 400));
		});
	},

	signin(req, res) {
		return Agent.findOne({
				where: {
					email: req.body.email
				}
			}).then(agen => {
				if (!agen) {
					return helper.res("Agent Not Found.", res, 404);
				}

				var passwordIsValid = helper.comparePassword(req.body.password, agen.password);
				if (!passwordIsValid) {
					return helper.res('Invalid Password!', res, 401);
				}

				var token = helper.generateToken(agen.id);

				res.status(200).send({
					email: req.body.email,
					accessToken: token,
					message: "Success"
				});
			}).catch(err => {
				res.status(500).send({
					email: req.body.email,
					accessToken: null,
					message: "Error",
					errors: err
				});
			});
	},
}