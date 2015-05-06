
var obj = function( obm, socket, x, y ) {
	this.obm = obm;
	this.socket = socket;
	
	this.chunk_pos = {
		'x':null,
		'y':null,
	}
	this.x = 0;
	this.y = 0;
	
	this.name = 'guest' + Math.round(Math.random() * 10000);
	
	this.setChunk( 0, 0 );
	
	var i = 0;
	while ( isset(this.obm._player[i]) && this.obm._player[i] != null ) {
		i += 1;
	}
	this._playerId = i;
	this.obm._player[ this._playerId ] = this;
	this.obm.playerCount += 1;
		
	console.log( 'client connected:  '+ this._playerId +' '+  this._chunkId );
	
	this.socket._player = this;
}

obj.prototype.relatif = function( n ) {
	var size = this.obm.chunk_manager.size, out = {}
	
	out.n = ( (n > (size / 2))? 1 : ((n < ((size / 2) * -1))? -1 : 0) );
	out.na =( (out.n!=0)? ( (out.n<1)? Math.floor((n + (size / 2)) / size) : Math.ceil((n - (size / 2)) / size) ) : 0 );
	out.nb = ((out.n * ((size / 2) * -1)) + n) - ((out.na - out.n) * size);
	
	out.localn = ( (out.nb<1)? out.nb * -1 : out.nb );
	
	if (out.nb < 1) {
		out.pos = ( (out.localn < (size / 2))? (size - out.localn) + ((size / 2) * -1) : (size / 2) - out.localn );
	} else {
		out.pos = ( (out.localn < (size / 2))? (out.localn) + ((size / 2) * -1) : out.localn - (size / 2) );
	}
	
	return ( out );
}

obj.prototype.setPos = function(x, y) {
	var xr = this.relatif( x ), yr = this.relatif( y );
	
	this.x = ( (xr.na == 0)? x : xr.pos );
	this.y = ( (yr.na == 0)? y : yr.pos );

	this.setChunk( this.chunk_pos.x + xr.na, this.chunk_pos.y + yr.na );
}

obj.prototype.setChunk = function( x, y ) {
	if ( this.chunk_pos.x != x || this.chunk_pos.y != y) {
		if ( isset(this.chunk) ) {
			this.chunk.removePlayer( this );
		}
		
		this.chunk_pos.x = x;
		this.chunk_pos.y = y;
		
		this.chunk = this.obm.chunk_manager.getChunk( x, y );
		this.chunk.addPlayer( this );
	}
}

obj.prototype.disconnect = function() {
	//this.chunk._player[ this._chunkId ] = null;
	this.obm._player[ this._playerId ] = null;
	this.chunk.removePlayer( this );
	
	this.obm.playerCount += -1;
	
	console.log( 'client disconnect: '+ this._playerId +' '+  this._chunkId  );
}

module.exports = obj;