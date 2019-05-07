let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MessageSchema = new Schema({
	data:{type:String},
	created:{type:Number}
});

let callsSchema = new Schema({
	src_number: {type:String},
	dest_number:{type:String},
	is_deleted:{type:Number, default:0},
	is_active:{type:Number, default:1},
	created:{type:Number}
});

let callsModel = mongoose.model('Calls', callsSchema);

callsModel.getCalls = function(Detail, fn){
	callsModel.findOne(Detail, fn);
}
callsModel.listCalls = function(search_creteria, fn){
	callsModel.find(search_creteria, fn).sort({'created':-1});
}
callsModel.addCalls = function(Detail, fn){
	let add_calls = new callsModel(Detail);
	add_calls.save(fn);
}
callsModel.updateCalls = function(search_criteria, new_data, fn){
	callsModel.update(search_criteria, {$set:new_data}, fn);
}

module.exports = callsModel;