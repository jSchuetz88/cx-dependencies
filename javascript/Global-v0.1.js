function sleep (time) {
	// IE kann sowas offenbar nicht...
	return new Promise((resolve) => setTimeout(resolve, time));
}

var Global = {
	Settings : {
		toggleTime : 200
	}
};

var Location = {
	protocol : function(){
		return window.location.protocol;
	},
	
	host : function(){
		return window.location.host;
	},
	
	pathname : function(){
		return window.location.pathname;
	},
	
	redirect : function(path){
		document.location = path;
	},
	
	sRedirect : function(uri){
		jPopup.confirm({
			title: '',
			content: '',
			accept: function(){
				Location.redirect(uri);
			}
		});
	}
};