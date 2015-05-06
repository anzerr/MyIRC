
var obj = function( obm ) {
	this.obm = obm;
	
	this.size = 64;
}

obj.prototype._initChunk = function( x, y ) {
	if ( !isset(this.obm._chunk[x]) ) {
		this.obm._chunk[x] = [];
	}

	if ( !isset(this.obm._chunk[x][y]) ) {
		this.obm._chunk[x][y] = new this.obm.core.include.chunk( this.obm, x, y );	
		console.log( 'new chunk loaded :'+ x +', '+ y );
	}
}

obj.prototype.getChunk = function( x, y ) {
	
	for (var offx = -1; offx <= 1; offx++) {
		for (var offy = -1; offy <= 1; offy++) {
			this._initChunk( x + offx, y + offy );
		}
	}

	return (this.obm._chunk[x][y]);
}

module.exports = obj;