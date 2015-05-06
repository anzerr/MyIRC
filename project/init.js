
var core = require('./module/core.js');
core = new core();
core.obm.core = core;

core.createServer( function( req, res ) {
	if (core.route(req, res) ) {
		core.include.fs.readFile(core.conf.dir_404, 'utf8', function( err, data ) {
			if (err) {
				return (true);
			}
			
			res.writeHead(404, {'Content-Type': core.fileContext('html')});
				res.write( data );
			res.end();
		} );
	}
} );

core.include.io.on('connection', function( socket ) {
	socket.on('data', function( data ) {
		var a = core.mvc( data, socket );
		if (!a) {
			console.log( a );
		}
	});
	
	socket.on('disconnect', function() {
		if (isset(this._player)) {
			this._player.disconnect();
		}
	});
});

console.log('Server running at http://127.0.0.1:80/');