module.exports = function(evt){
	/*
	Function name : TransferCall
	Parameter 	  : Nothing
	Purpose		  : This function is used to transfer call to live agent if bots unable to handle that call.
	Author		  : Hitesh Jain
	*/
	this.TransferCall = function(phonenumber){
		ami.action({
			'action':'Setvar',
			'Channel': evt['channel'],
			'Variable':'SAY_NUMBER',
			'Value':phonenumber
		}, function(err, data){
			ami.action({
				'action':'Redirect',
				'channel': evt['channel'],
				'Exten':'say-dial',
				'Context':'say-dial',
				'Priority':1
			}, function(err, data){
				otherData[evt['channel']]['transferred'] = true;
			});
		});
	}
	
	this.setVarAndDisconnect = function(varVal){
		ami.action({
			'action':'Setvar',
			'Channel': evt['channel'],
			'Variable':'MESSAGE',
			'Value':varVal
		}, function(err, data){
			ami.action({
				'action':'Redirect',
				'channel': evt['channel'],
				'Exten':'say-hangup',
				'Context':'say-hangup',
				'Priority':1
			}, function(err, data){
			});
		});
	}
	
	this.setVarAndRedirect = function(varVal){
		ami.action({
			'action':'Setvar',
			'Channel': evt['channel'],
			'Variable':'MESSAGE',
			'Value':varVal
		}, function(err, data){
			ami.action({
				'action':'Redirect',
				'channel': evt['channel'],
				'Exten':'say-message',
				'Context':'say-message',
				'Priority':1
			}, function(err, data){
				
			});
		});
	}
	
	/*
	Function name : PlayMessage
	Parameter 	  : Nothing
	Purpose		  : This function used to send text to asterisk to play in call.
	Author		  : Hitesh Jain
	*/
	this.PlayMessage = function(){  // arrMessage, inTTS,  prevMessage, 
		let arrMessage = otherData[evt['channel']]['arrMessage'];
		console.log(arrMessage);
		if(arrMessage.length>0 && otherData[evt['channel']]['inTTS'] == 0){
			otherData[evt['channel']]['inTTS'] = 1;
			que  = arrMessage[0];
			que = que.replace(/,/g, ".");
			ami.action({
				'action':'Setvar',
				'Channel': evt['channel'],
				'Variable':'PLAYTTS_STRING',
				'Value':que
			}, function(err, data){
				ami.action({
					'action':'Redirect',
					'channel': evt['channel'],
					'Exten':'say-tts',
					'Context':'say-tts',
					'Priority':1
				}, function(err, data){
					otherData[evt['channel']]['arrMessage'].shift();
				});
			});
		}
		else{
			
			ami.action({
				'action':'Redirect',
				'channel': evt['channel'],
				'Exten':'say-recognition',
				'Context':'say-recognition',
				'Priority':6
			}, function(err, data){
				
			});
		}
	}
	
	this.NumberConversion = function(data){
		data = data.replace(/one/g, "1");
		data = data.replace(/two/g, "2");
		data = data.replace(/three/g, "3");
		data = data.replace(/four/g, "4");
		data = data.replace(/five/g, "5");
		data = data.replace(/six/g, "6");
		data = data.replace(/seven/g, "7");
		data = data.replace(/eight/g, "8");
		data = data.replace(/nine/g, "9");
		data = data.replace(/zero/g, "0");
		data = data.replace(/ /g, "");
		return data;
		
	}
}