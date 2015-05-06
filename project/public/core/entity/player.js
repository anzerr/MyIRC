
var player = function( obm ) {
	var self = this;
	self.obm = obm;

	self.chunk = {
		'x':0,
		'y':0,
	}
	
	this.x = 0;
	this.y = 0;
	
	this.auth = false;
	this.disabled = false;
}

player.prototype.setPos = function(x, y) {
	this.x = x;
	this.y = y;

	this.obm.socket.emit( 'data', JSON.stringify({
		'c':'player',
		'a':'setpos',
		'p':{
			'x':this.x,
			'y':this.y,
		}
	}) );
}

player.prototype.run = function() {
	if (!this.obm.chat_manager.focus) {
		if ((keystats[40] || keystats[38] || keystats[39] || keystats[37]) && !this.disabled) {
			this.setPos( this.x + ( (keystats[40])? 1 : ((keystats[38])? -1 : 0) ), this.y + ( (keystats[39])? 1 : ((keystats[37])? -1 : 0) ) );
		}
	}
}
