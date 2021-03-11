'use strict';
const agentController = require('../controllers').agentController;
const playerController = require('../controllers').playerController;
const agentValidation = require('../middlewares').agentValidation;
const playerValidation = require('../middlewares').playerValidation;
const verifyJwtTokenController = require('../middlewares').verifyJwtToken;

module.exports = function(app) {

	app.post('/api/auth/signin', agentController.signin);

    app.get('/api/agent', verifyJwtTokenController.verifyToken, agentController.all);		// get all data
    app.get('/api/agent/agent', verifyJwtTokenController.verifyToken, agentController.allAgent);       // get all data role agent
    app.get('/api/agent/:code', verifyJwtTokenController.verifyToken, agentController.getByCode);		// get data berdasarkan agent code
	app.get('/api/agent/agent/:code', verifyJwtTokenController.verifyToken, agentController.getAgentByCode);      // get data berdasarkan agent code dengan role agent
    app.post('/api/agent', agentValidation.createAgent(), agentController.insert);		// buat data dengan rule master
	app.post('/api/agent/:parent_id/agent', [...agentValidation.createAgentByParent(), verifyJwtTokenController.verifyToken], agentController.insertByParent);		// buat data dengan rule agent
	app.put('/api/agent/:code', [...agentValidation.updateAgent(), verifyJwtTokenController.verifyToken], agentController.update);		// edit data dengan agent code tertentu
    app.put('/api/agents/:id', [...agentValidation.updateAgent(), verifyJwtTokenController.verifyToken], agentController.updates);      // edit data dengan agent parent id tertentu
    app.delete('/api/agent/:code', verifyJwtTokenController.verifyToken, agentController.delete);	// hapus data dengan agent code tertentu
    
    app.post('/api/player', [playerValidation.createPlayer(), verifyJwtTokenController.verifyToken], playerController.insert);
    app.get('/api/player', verifyJwtTokenController.verifyToken, playerController.all);
    app.get('/api/player/:id', verifyJwtTokenController.verifyToken, playerController.getById);
    app.put('/api/player/:id', [...playerValidation.updatePlayer(), verifyJwtTokenController.verifyToken], playerController.update);		// edit data dengan agent code tertentu
    app.delete('/api/player/:id', verifyJwtTokenController.verifyToken, playerController.delete);  // hapus data dengan player code tertentu
    
};