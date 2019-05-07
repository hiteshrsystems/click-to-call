let asterisk = require('./asteriskController.js');
var config = require('./../config');
let userModel = require('./../model/userModel');
let callsModel = require('./../model/callsModel');
let mongoose = require('mongoose');

module.exports = function(evt){
	let asteriskObj = new asterisk(evt);
	this.callDestination = function(){
		callsModel.findOne({'_id':mongoose.Types.ObjectId(evt.destaccountcode)}, function(err, data){
			if(!err && data != null){
				ami.action({
					'action':'Setvar',
					'Channel': evt['destchannel'],
					'Variable':'DIALED_NUMBER',
					'Value':data.dest_number
				}, function(err, data){
					ami.action({
						'action':'Redirect',
						'channel': evt['destchannel'],
						'Exten':'click-to-call',
						'Context':'click-to-call',
						'Priority':1
					}, function(err, data){
						console.log(err);
						console.log(data);
					});
				});
			}
		});
	}
	
}