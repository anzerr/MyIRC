
module.exports = {
	'msg':function( obm, arg, socket ) {
		if ( isset(socket._player) ) {
			var ply = socket._player;
			var pos = ply.chunk_pos;
			
			var re = /\/+([A-Za-z])+/g;
			var type = ( (arg.msg).match(re) );

			if (type !== null) {
				type = type[0];
				var string = ( arg.msg ).substring( arg.msg.length,  type.length + 1 );
			} else {
				type = '/local';
				var string = arg.msg;
			}
				
			var msg = {
				'c':'chat',
				'a':'addmsg',
			}
				
			if (type == '/g') {
				msg.p = '<span style="color:green;">'+ ply.name +'</span> : '+ string +'<br>';
				for (var i in obm._player ) {
					if ( obm._player[i] != null ) {
						obm._player[i].socket.emit('data', msg);
					}
				}
			} else if (type == '/local') {
				msg.p = '<span style="color:black;">'+ ply.name +' : '+ string +'</span><br>';
				var plylist = obm._chunk[pos.x][pos.y]._player;
				for (var i in plylist) {
					if (plylist[i] != null) {
						plylist[i].socket.emit('data', msg);
					}
				}
			} else if (type == '/yell') {
				msg.p = '<span style="color:red;">'+ ply.name +'</span> : '+ string +'<br>';
				for (var offx = -1; offx <= 1; offx++) {
					for (var offy = -1; offy <= 1; offy++) {
						var plylist = obm._chunk[pos.x + offx][pos.y + offy]._player;
						for (var i in plylist) {
							if (plylist[i] != null) {
								plylist[i].socket.emit('data', msg);
							}
						}
					}
				}
			} else if (type == '/wisper' || type == '/w' || type == '/msg') {
				var pm = string.split( ' ' );
				if (pm.length >= 2) {
					pm = pm[0];
					string = string.substring( string.length,  pm.length + 1 );
					
					msg.p = '<span style="color:purple;">'+ ply.name +'</span> : '+ string +'<br>';
					for (var i in obm._player ) {
						if ( obm._player[i] != null ) {
							if (obm._player[i].name == pm || obm._player[i] == ply ) {
								obm._player[i].socket.emit('data', msg);
							}
						}
					}
				}
			} else if (type == '/nick') {
				var pm = string.split( ' ' );
				if (pm.length >= 1) {
					var last = ply.name;
					ply.name = pm[0];
					
					msg.p = '<span style="color:green;">'+ last +'</span> has changed there name to <span style="color:green;">'+ ply.name +'</span>.<br>';
					for (var i in obm._player ) {
						if ( obm._player[i] != null ) {
							obm._player[i].socket.emit('data', msg);
						}
					}
				}
			} else if (type == '/list') {
				var pm = string.split( ' ' );
				var tmp = '';
				
				for(var x in obm._chunk) {
					for(var y in obm._chunk[x]) {	
						if (pm.length >= 1) {
							var name = x +','+ y;
							if ( name.indexOf(pm[0]) != -1 ) {
								tmp += '<span style="color:yellow;">channel</span> : '+ name +'<br>';
							}
						} else {
							tmp += '<span style="color:yellow;">channel</span> : '+ x +','+ y +'<br>';
						}
					}
				}

				msg.p = tmp;
				ply.socket.emit('data', msg)
			} else if (type == '/join') {
				var pm = string.split( ' ' );
				if (pm.length >= 1) {
					var cord = pm[0].split( ',' );
					
					if (parseInt(cord[0]) != 'NaN' && parseInt(cord[1]) != 'NaN') {
						obm.chunk_manager.getChunk( parseInt(cord[0]), parseInt(cord[1]) );
						ply.setChunk( parseInt(cord[0]), parseInt(cord[1]) );
					}
				}
			} else if (type == '/part') {
				ply.setChunk( 0, 0 );
			} else if (type == '/users') {
				var plylist = obm._chunk[pos.x][pos.y]._player, tmp = '';
				for (var i in plylist) {
					if (plylist[i] != null) {
						tmp += 'user : '+ plylist[i].name +'<br>';
					}
				}
				
				msg.p = tmp;
				ply.socket.emit('data', msg)
			}
		}
		return (true);
	},
};