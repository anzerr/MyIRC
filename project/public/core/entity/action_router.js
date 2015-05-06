
var action_router = function( obm ) {
	this.obm = obm;
}

action_router.prototype.route = function( data ) {
	this[ data.a ]( data.p );
}

action_router.prototype.authrep = function( data ) {
	this.obm.player.auth = data.auth;
	this.obm.gui.connect.style( { 'BColor':( (this.obm.player.auth)? 'green' : 'red' ) } );
	this.obm.chat_manager.elem.body.style( { 'display':'block' } );
}

action_router.prototype.loadchunk = function( data ) {
	this.obm.chunk_manager.load( data.pos.x, data.pos.y, data.data );
}

action_router.prototype.updateselfpos = function( data ) {
	this.obm.player.chunk = data.chunk;
	this.obm.player.x = data.x;
	this.obm.player.y = data.y;
}

action_router.prototype.updatepos = function( data ) {
	var chunk = this.obm.chunk_manager.get(data.chunk.x, data.chunk.y);

	if (chunk) {
		chunk.player[data.plyid].x = data.x;
		chunk.player[data.plyid].y = data.y;
	}
}

action_router.prototype.chunkentity = function( data ) {
	var chunk = this.obm.chunk_manager.get(data.chunk.x, data.chunk.y);
	
	console.log( 'load chunk: '+ data.chunk.x +', '+ data.chunk.y );

	if (chunk) {
		chunk.player = data.player;
		chunk.entity = data.entity;
	}
	
	this.obm.chunk_manager.needloading += -1;
	if (this.obm.chunk_manager.needloading <= 0) {
		this.obm.chunk_manager.reload_display();
	}
}

action_router.prototype.addplayer = function( data ) {
	var chunk =  this.obm.chunk_manager.get(data.chunk.x, data.chunk.y);
	
	console.log( 'add ent: '+data.plyid +' on '+ data.chunk.x +', '+ data.chunk.y );
	console.log( data );
	
	if (chunk) {
		chunk.player[data.plyid] = data;
		
		console.log( chunk.player[data.plyid] );
	}
}

action_router.prototype.removeplayer = function( data ) {
	var chunk =  this.obm.chunk_manager.get(data.chunk.x, data.chunk.y);
		
	console.log( 'remove ent: '+data.plyid +' on '+ data.chunk.x +', '+ data.chunk.y );
	
	if (chunk) {
		if (isset(chunk.player[data.plyid])) {
			console.log( 'entity is set: '+data.plyid );
		}
	
		chunk.player[data.plyid] = null;
	}
}

action_router.prototype.addmsg = function( data ) {
	this.obm.chat_manager.addmsg( data );
}
