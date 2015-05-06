
var obj = function( obm, x, y ) {
	this.obm = obm;
	this.x = x;
	this.y = y;
	
	this._player = [];
	this._entity = [];
	
	this.color = 'rgb(' + Math.round( Math.random() * 255 ) + ',' + Math.round( Math.random() * 255 ) + ',' + Math.round( Math.random() * 255 ) + ')'; 
}

obj.prototype.addPlayer = function( ply ) {
	var i = 0;
	while ( isset(this._player[i]) && this._player[i] != null ) {
		i += 1;
	}

	console.log( 'add player id: '+ i +' on to pos ('+ this.x +', '+ this.y +')'  );
	
	ply._chunkId = i;
	this._player[ ply._chunkId ] = ply;
	
	var msg = {
		'c':'player',
		'a':'addplayer',
		'p':{
			'plyid':ply._chunkId,
			'chunk':{
				'x':ply.chunk_pos.x,
				'y':ply.chunk_pos.y,
			},
			'x':ply.x,
			'y':ply.y,
		}
	}
	
	for (var offx = -1; offx <= 1; offx++) {
		for (var offy = -1; offy <= 1; offy++) {
			if (isset(this.obm._chunk[this.x + offx][this.y + offy])) {
				var plylist = this.obm._chunk[this.x + offx][this.y + offy]._player;
				for (var i in plylist) {
					if (plylist[i] != null) {
						plylist[i].socket.emit('data', msg);
					}
				}
			}
		}
	}
}

obj.prototype.removePlayer = function( ply ) {

	var msg = {
		'c':'player',
		'a':'removeplayer',
		'p':{
			'plyid':ply._chunkId,
			'chunk':{
				'x':ply.chunk_pos.x,
				'y':ply.chunk_pos.y,
			},
			'x':ply.x,
			'y':ply.y,
		}
	}
	
	for (var offx = -1; offx <= 1; offx++) {
		for (var offy = -1; offy <= 1; offy++) {
			if (isset(this.obm._chunk[this.x + offx][this.y + offy])) {
				var plylist = this.obm._chunk[this.x + offx][this.y + offy]._player;
				for (var i in plylist) {
					if (plylist[i] != null) {
						plylist[i].socket.emit('data', msg);
					}
				}
			}
		}
	}

	
	console.log( 'del player id: '+ ply._chunkId +' on to pos ('+ this.x +', '+ this.y +')'  );
	
	this._player[ ply._chunkId ] = null;
}

module.exports = obj;