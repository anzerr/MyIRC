
var gui = function( obm ) {
	var self = this;
	self.obm = obm;

	self.connect = new create_div( );
	self.connect.style( { 'BColor':'red', '*innerHTML':'connect', 'position':'absolute', 'top':'0px', 'left':'0px', 'width':'100%' } );
	self.connect.addEvent( 'click', function() {
		self.obm.socket.emit( 'data', JSON.stringify({
			'c':'player',
			'a':'login',
			'p':{
				'user':'cat',
				'password':'pass',
			}
		}) );
	});
	
	self.contaner = new create_div( );
	self.contaner.style( { 'BColor':'black', 'width':'100%', 'height':'100%', } );
}