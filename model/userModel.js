let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
	name:{type:String},
	extension:{type:String},
	phone_number:{type:String},
	designation:{type:String}
});

let userModel = mongoose.model('User', userSchema);

userModel.getUser = function(Detail, fn){
	userModel.findOne(Detail, fn);
}
userModel.listUser = function(search_creteria, fn){
	userModel.find(search_creteria, fn);
}
userModel.addUser = function(Detail, fn){
	let add_user = new userModel(Detail);
	add_user.save(fn);
}
userModel.updateUser = function(search_criteria, new_data, fn){
	userModel.update(search_criteria, {$set:new_data}, fn);
}

module.exports = userModel;