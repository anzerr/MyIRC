
module.exports = {	
	'getchunk':function( obm, arg, socket ) {
		if ( isset(socket._player) && isset(arg.x) && isset(arg.y) ) {
			var ply = socket._player;
			var chunk = obm._chunk[arg.x][arg.y];

			if (isset(chunk)) {
				ply.socket.emit('data', {
					'c':'chunk',
					'a':'loadchunk',
					'p':{
						'pos':{
							'x':chunk.x,
							'y':chunk.y,
						},
						'data':{
							'color':chunk.color,
							'size':obm.chunk_manager.size,
						}
					},
				});
			}
			
			return (true);
		}
		return (false);
	},
	
	'getentity':function( obm, arg, socket ) {
		if ( isset(socket._player) && isset(arg.x) && isset(arg.y) ) {
			var ply = socket._player;
			var chunk = obm._chunk[arg.x][arg.y];

			if (isset(chunk)) {
				var player = [], entity = [];
			
				for (var i in chunk._player) {
					if (chunk._player[i] != null) {
						player[ i ] = {
							'plyid':chunk._player[i]._chunkId,
							'chunk':{
								'x':chunk._player[i].chunk_pos.x,
								'y':chunk._player[i].chunk_pos.y,
							},
							'x':chunk._player[i].x,
							'y':chunk._player[i].y,
						}
					} else {
						player[ i ] = null;
					}
				}
				
				for (var i in chunk._entity) {
					if (plylist[i] != null) {
						player[ i ] = {
							'plyid':chunk._entity[i]._chunkId,
							'chunk':{
								'x':chunk._entity[i].chunk_pos.x,
								'y':chunk._entity[i].chunk_pos.y,
							},
							'x':chunk._entity[i].x,
							'y':chunk._entity[i].y,
						}
					} else {
						player[ i ] = null;
					}
				}
			
				ply.socket.emit('data', {
					'c':'chunk',
					'a':'chunkentity',
					'p':{
						'chunk':{
							'x':chunk.x,
							'y':chunk.y,
						},
						'player':player,
						'entity':entity
					},
				});
			}
			
			return (true);
		}
		return (false);
	},
};