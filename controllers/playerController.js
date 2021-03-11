const Player = require('../models').Player;
const Agent = require('../models').Agent;
const helper = require('./helpers');
const redis = require('redis');
const client = redis.createClient();
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

	        return Agent.findByPk(req.body.agent_id)
	        .then(ag => {
	        	Player.create({
	        		agent_id	: 	ag.id,
					displayName	: 	ag.username,
					badge		: 	req.body.badge,
					token		: 	helper.randomString(),
				}).then(success => {
					helper.res('create player success', res);
				}).catch(error => {
					helper.res(error, res, 400);
				});
	        })
	        .catch((err) => {
	        	return helper.res(error, res, 400);
	        });
		} catch(error) {
			helper.res(error, res, 400);
			return;
		}
	},

	all(req, res) {
		const redisKey = 'player-all';
		try {
			client.get(redisKey,(err,data) => {
		        if(data){// cek apakah ada di redis atau tidak
		            return helper.res(JSON.parse(data), res, 200);
		        }else{
		        	const players = Player.findAll({ include: [{model: Agent, as: 'agent'}] })
		        	.then(data => {
		        		// simpan hasil query ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)
		        		client.set(redisKey,JSON.stringify(data),'EX',60); 
		        		return helper.res(data, res);
		        	});
		        }
		    });
		} catch (err) {
			return helper.res(err, res, 400);
		}
	},

	getById(req, res) {
		const redisKey = 'player-get-' + req.params.id;
		try {
			client.get(redisKey,(err,data) => {
				if(data) {
					return helper.res(JSON.parse(data), res, 200);
				}
				else {
					const players = Player.findByPk(req.params.id, { include: { model: Agent, as: 'agent' } })
		        	.then(data => {
		        		// simpan hasil query ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)
		        		client.set(redisKey,JSON.stringify(data),'EX',60); 
		        		return helper.res(data, res);
		        	})
		        	.catch((errs) => {
		        		return helper.res('Player not found', res, 400);
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

	        return Player.findByPk(req.params.id)
	        .then(user => {
	        	user.update({
					badge		: 	req.body.badge || user.badge,
				}).then(success => {
					helper.res('update player success', res);
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

	delete(req, res) {
		return Player.findById(req.params.id)
		.then(user => {
			if(!user) helper.res('Player Not Found', res, 400);
			
			return user.destroy()
			.then( () => helper.res('Success remove player', res, 204) )
			.catch((err) => helper.res(err, res, 400));
		});
	},
};