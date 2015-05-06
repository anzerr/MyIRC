
isset = function(a) { return ( (typeof(a) !== 'undefined')? true : false ); }

var obj = function () {
	
}

var include = {
	'url'					:require('url'),
	'http'					:require("http"),
	'fs'					:require('fs'),
	'net'					:require('net'),
	'chunk_manager'	:require('./Entity/chunk_manager.js'),
	'chunk'				:require('./Entity/chunk.js'),
	'player'				:require('./Entity/player.js'),
}
obj.prototype.include = include;

var conf = {
	'port'			:80,
	'ip'				:'10.41.177.64',
	'public_dir'	:'./public/',
	'cache_dir'	:'./cache/',
	'dir_404'		:'./public/404.html',
}
obj.prototype.conf = conf;

var context_type = {
	'html'	:'text/html',
	'js'		:'text/javascript',
	'jpg'	:'image/jpeg',
}

obj.prototype.fileContext = function( a ) {
	if ( isset(context_type[a]) ) {
		return ( context_type[a] );
	}
	return ( 'text/html' );
}

obj.prototype.minify = function(path) {

	// CAN ADD MINIFY

	return (path.real);
}

obj.prototype.route = function(req, res) {
	var self = this, tmp, path = {};
	
	path.url = this.include.url.parse(req.url).pathname;
	path.real = ( ((path.url === '/')? 'index.html' : path.url) ).replace(/\/\//g, '/');
	path.cached = self.conf.cache_dir + path.real.replace(/\//g, '_');
	path.real = self.conf.public_dir + path.real;
	path.extension = (tmp = path.real.split('.'))[ tmp.length - 1 ];

	var url = ( (!self.include.fs.existsSync(path.cached))? this.minify( path ) : path.real );

	if ( self.include.fs.existsSync(url) ) {
		self.include.fs.readFile(url, function(err, data) {
			if (err) throw err; 

			res.writeHead(200, {'Content-Type': self.fileContext( path.extension )});
			res.end( data );
		} );
	} else {
		return (true);
	}
	
	return (false);
}

obj.prototype.createServer = function( callback ) {
	if (!isset(this.server)) {
		this.server = ( this.include.http.createServer( callback ).listen( this.conf.port, this.conf.ip ) );
		this.include.io = require('socket.io').listen(this.server);
	}
}

obj.prototype.loaded_controler = {};

obj.prototype.load_controler = function( name ) {
	var full = name + 'Controler.js';
	
	if ( !isset(this.loaded_controler[full]) ) {
		if ( this.include.fs.existsSync('./module/Controler/' + full) ) {
			this.loaded_controler[full] = require('./Controler/' + full);
		} else {
			return (false);
		}
	} 
	
	return (this.loaded_controler[full]);
}

obj.prototype.mvc = function( data, socket ) {
	var controler, param = JSON.parse( data );

	if (controler = this.load_controler( param.c )) {
		return ( controler[ param.a ](this.obm, param.p, socket) );
	}
	return (false);
}

var obm = {
	'_chunk':[],
	'_player':[],
	'playerCount':0,
}
obm.chunk_manager = new include.chunk_manager( obm );

obj.prototype.obm = obm;

module.exports = obj;