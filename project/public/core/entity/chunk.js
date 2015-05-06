
var chunk = function( obm, x, y, data ) {
	this.obm = obm;
	
	this.x = x;
	this.y = y;
	this.data = data;
	
	this.player = [];
	this.entity = [];
	
	this.parent = this.obm.gui.contaner.div;
	this.canvas = new create_div({ 'p':this.parent, 't':'canvas' });
	this.canvas.style( { 
		'BColor':this.data.color, 'width':this.data.size + 'px', 'height':this.data.size + 'px', 'position':'absolute', 
		'top':( (parseInt(this.parent.offsetWidth) / 2) + ((this.x - this.obm.player.chunk.x) * this.data.size) )+'px', 
		'left':( (parseInt(this.parent.offsetHeight) / 2) + ((this.y - this.obm.player.chunk.y) * this.data.size) )+'px'
	} );

	this.canvas.div.width = this.canvas.div.offsetWidth;
	this.canvas.div.height = this.canvas.div.offsetHeight;
	
	this.display = false;
}

chunk.prototype.update = function( ) {
	this.canvas.style( { 
		'display':'block' 
	} );
	
	this.display = true;
	
	this.obm.socket.emit( 'data', JSON.stringify({
		'c':'chunk',
		'a':'getentity',
		'p':{
			'x':this.x,
			'y':this.y,
		}
	}) );
}

chunk.prototype.unload = function( ) {
	this.canvas.style( { 
		'display':'none' 
	} );
	
	this.display = false;
}

chunk.prototype.render = function( ) { 
	if (this.display) {
		this.canvas.style( { 
			'top':( (parseInt(this.parent.offsetHeight) / 2) + ((this.x - this.obm.player.chunk.x) * this.data.size) - this.obm.player.x )+'px', 
			'left':( (parseInt(this.parent.offsetWidth) / 2) + ((this.y - this.obm.player.chunk.y) * this.data.size) - this.obm.player.y )+'px',
		} );
	
		var canvas = this.canvas.div;
		var ctx = canvas.getContext("2d");
		
		ctx.fillStyle = this.data.color;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		ctx.fillStyle = 'black';
		ctx.font = '20px Georgia';
		ctx.fillText( this.x +', '+ this.y, 0, 20);
		
		for (var i in this.player) {
			if (this.player[i] != null) {
				ctx.beginPath();
				ctx.rect( (canvas.width / 2) + this.player[i].y, (canvas.height / 2) +  this.player[i].x, 4, 4 );
				ctx.fillStyle = 'red';
				ctx.fill();
			}
		}
	}
}
