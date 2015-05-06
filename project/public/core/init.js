
var isset = function( e ) {
	return (typeof e !== 'undefined');
}

var keystats = [];
window.addEventListener("keyup", function(e) { keystats[e.keyCode] = false; }, false);
window.addEventListener("keydown", function(e) { keystats[e.keyCode] = true; }, false);

window.requestAnimFrame = (function(){
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame	||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		}
	);
})();

(function() {
	window.addEventListener('load', function() {
		
		var obm = {};
			obm.socket = io();
			obm.action_router = new action_router( obm );
			obm.gui = new gui( obm );
			obm.chunk_manager = new chunk_manager( obm );
			obm.player = new player( obm );
			obm.chat_manager = new chat_manager( obm );
			
		obm.socket.on('data', function (data) {
			obm.action_router.route( data );
		});
		
		var render = function() {
			if (obm.player.auth) {
				obm.chunk_manager.run();
				obm.player.run();
				obm.chat_manager.run();
			}
		}
		
		var animloop = function() { requestAnimFrame(animloop); render(); }
		animloop();
	}, false);
})();
