
var chunk_manager = function( obm ) {
	this.obm = obm;
	
	this.lastrun = { 'x':null, 'y':null };
	this.waitingload = false;
}

chunk_manager.prototype.chunk = []

chunk_manager.prototype.load = function(x, y, data) {
	if ( !isset(this.chunk[x]) ) {
		this.chunk[x] = [];
	}

	if ( !isset(this.chunk[x][y]) ) {
		this.chunk[x][y] = new chunk( this.obm, x, y, data );	
	}

	this.chunk[x][y].update();
}

chunk_manager.prototype.get = function(x, y) {
	if ( isset(this.chunk[x]) ) {
		if ( isset(this.chunk[x][y]) ) {
			return (this.chunk[x][y]);
		}
	}

	return (false);
}

chunk_manager.prototype.reload_display = function() {
	var cur = { 'x':this.obm.player.chunk.x, 'y':this.obm.player.chunk.y };
	
	if (isset(this.lastrun) && isset(this.obm.player.chunk) && this.lastrun.x != null && this.lastrun.y != null) {
		var hide = { 'x':cur.x - (Math.min( 1, Math.max( -1, (cur.x - this.lastrun.x) * 2)) * 2), 'y':cur.y - (Math.min( 1, Math.max( -1, (cur.y - this.lastrun.y) * 2)) * 2) };
		
		if (hide.x == this.obm.player.chunk.x) {
			for (var offx = -1; offx <= 1; offx++) {
				var chunk = this.get( this.obm.player.chunk.x + offx, hide.y );
				if (chunk) {
					chunk.unload( );
				}
			}
		} else {
			for (var offy = -1; offy <= 1; offy++) {
				if (hide.y == this.obm.player.chunk.y) {
					var chunk = this.get( hide.x, this.obm.player.chunk.y + offy );
					if (chunk) {
						chunk.unload( );
					}
				} else {
					for (var offy = -1; offy <= 1; offy++) {
						var chunk = this.get( hide.x + offx, hide.y + offy);
						console.log( (hide.x + offx) +', '+ (hide.y + offy) );
						
						if (chunk) {
							chunk.unload( );
						}
					}
				}
			}
		}
	}

	this.obm.player.disabled = false;
	this.waitingload = false;
	this.lastrun = cur;
}

chunk_manager.prototype.run = function() {
	var cur = { 'x':this.obm.player.chunk.x, 'y':this.obm.player.chunk.y };
	if ( (this.lastrun.x != cur.x || this.lastrun.y != cur.y) && !this.waitingload) {
		this.obm.player.disabled = true;
		this.waitingload = true;
	
		this.needloading = 0;
		for (var offx = -1; offx <= 1; offx++) {
			for (var offy = -1; offy <= 1; offy++) {
				this.obm.socket.emit( 'data', JSON.stringify({
					'c':'chunk',
					'a':'getchunk',
					'p':{
						'x':this.obm.player.chunk.x + offx,
						'y':this.obm.player.chunk.y + offy,
					}
				}) );

				this.needloading += 1;
			}
		}
		
		console.log( this.needloading );
	}
	
	this.render();
}

chunk_manager.prototype.render = function( ) {
	for (var offx = -1; offx <= 1; offx++) {
		for (var offy = -1; offy <= 1; offy++) {
			var chunk = this.get( this.obm.player.chunk.x + offx, this.obm.player.chunk.y + offy );
			
			if (chunk) {
				chunk.render();
			}
		}
	}
}
