
module.exports = {
	'login':function( obm, arg, socket ) {
		socket.auth = true;
		var out = false
		
		if ( !isset(socket._player) && isset(socket.auth) && socket.auth ) {
			new obm.core.include.player( obm.core.obm, socket, 1, 1 );
			out = true;
		}
		
		socket.emit('data', {
				'c':'player',
				'a':'authrep',
				'p':{
					'auth':socket.auth,
				}
		});
		return (out);
	},
	
	'setpos':function( obm, arg, socket ) {
		if ( isset(socket._player) && isset(arg.x) && isset(arg.y) ) {
			var ply = socket._player;
			ply.setPos( parseInt(arg.x), parseInt(arg.y) );
			
			var id = ply._chunkId;
			var pos = ply.chunk_pos;
			
			var msg = {
				'c':'player',
				'a':'updatepos',
				'p':{
					'plyid':id,
					'chunk':{
						'x':pos.x,
						'y':pos.y,
					},
					'x':ply.x,
					'y':ply.y,
				},
			}
			
			for (var offx = -1; offx <= 1; offx++) {
				for (var offy = -1; offy <= 1; offy++) {
					var plylist = obm.chunk_manager.getChunk( pos.x + offx, pos.y + offy )._player
					
					for (var i in plylist) {
						if (plylist[i] != null) {
							plylist[i].socket.emit('data', msg);
						}
					}
				}
			}
			
			msg.a = 'updateselfpos';
			ply.socket.emit('data', msg);
			
			return (true);
		}
		return (false);
	},
	
	'playerlist':function( obm, arg, socket ) {
		if ( isset(socket._player) ) {
			var ply = socket._player;
			var pos = ply.chunk_pos;

			var msg = [];
			for (var offx = -1; offx <= 1; offx++) {
				for (var offy = -1; offy <= 1; offy++) {
					var plylist = obm._chunk[pos.x + offx][pos.y + offy]._player;
					for (var i in plylist) {
						if (plylist[i] != null) {
							msg[ msg.length ] = {
								'plyid':plylist[i]._playerId,
								'chunk':{
									'x':plylist[i].chunk_pos.x,
									'y':plylist[i].chunk_pos.y,
								},
								'x':plylist[i].x,
								'y':plylist[i].y,
							}
						}
					}
				}
			}
			ply.socket.emit('data', {
				'c':'player',
				'a':'playerlist',
				'p':msg,
			});
		
			return (true);
		}
		return (false);
	},
};