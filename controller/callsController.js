let callsModel = require('./../model/callsModel');
let config = require('./../config');

let makeCall = function(req, res){
	
	let customer_number = req.body.customer;
	let agent_number = req.body.agent;
	
	let obj = {
		'src_number':agent_number,
		'dest_number':customer_number,
		'created':Date.now()
	};
	callsModel.addCalls(obj, function(errSave, dataSave){
		console.log(dataSave);
		if(!errSave){
			ami.action({
				Action: 'Originate',
				Channel: agent_number,
				Account: dataSave['_id'].toString(),
				Exten: 'click-to-call-wait',
				Context: 'click-to-call',
				Priority: 1,
				Timeout: '30000',
				CallerID: 'Hitesh Jain',
				Async:true,
				Codecs:'alaw,ulaw'
			}, function(err, data){
				res.json({'success':'Call made successfully'});
			});
		}
	})
}

module.exports = function(){
	this.makeCall = makeCall;
}