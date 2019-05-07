module.exports = function(app, express){
	var router = express.Router();
	var callsController = require("../controller/callsController");
	var callsObj = new callsController();
	
	// Login functionality
	router.post('/', function(req, res){
		callsObj.makeCall(req, res);
	});
	
	app.use('/calls', router);
}