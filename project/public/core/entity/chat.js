
var chat_manager = function( obm ) {
	var self = this;
	self.obm = obm;

	self.elem = {};
	
	self.elem.body = new create_div({ 't':'div' });
	self.elem.body.style( { 'maxWidth':'400px', 'maxHeight':'200px', 'width':'90%', 'height':'100%', 'BColor':'rgb(30, 30, 30)', 'position':'absolute', 'bottom':'20px', 'left':'0px', 'display':'none', 'P':'10px', 'borderRadius':'0px 10px 10px 0px' } );
		
	self.elem.text_body = new create_div({ 'p':self.elem.body, 't':'div' });
	self.elem.text_body.style( { 'width':'calc(100% - 6px)', 'height':'calc(100% - 26px)', 'BColor':'white', 'overflowY':'scroll', 'P':'3px' } );
	
	self.elem.text = new create_div({ 'p':self.elem.text_body, 't':'div' });
	self.elem.text.style( { 'width':'100%', 'height':'auto' } );
	
	self.elem.input = new create_div({ 'p':self.elem.body, 't':'input' });
	self.elem.input.style( { 'width':'100%', 'height':'20px', 'type':'text', 'pointerEvents':'none' } );

	self.log = '';
	self.focus = false;
	self.key = false;
}

chat_manager.prototype.addmsg = function( msg ) {
	this.log += msg
	this.elem.text.style( { '*innerHTML':this.log } );
	this.elem.text_body.style( { '*scrollTop':this.elem.text.div.scrollHeight } );
}

chat_manager.prototype.msg = function( string ) {
	if (string != '') {
		this.obm.socket.emit( 'data', JSON.stringify({
			'c':'chat',
			'a':'msg',
			'p':{
				'msg':string,
			}
		}) );
	}
}

chat_manager.prototype.run = function() {
	if (keystats[13]) {
		if (!this.key) {
			this.key = true;
			
			this.elem.input.div[ ((!this.focus)? 'focus' : 'blur') ]();
			if (this.focus) {
				this.msg( this.elem.input.div.value );
				this.elem.input.div.value = '';
			}
			
			this.focus = !this.focus
		}
	} else {
		this.key = false;
	}
}