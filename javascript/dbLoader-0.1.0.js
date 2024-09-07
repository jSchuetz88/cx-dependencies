function dbLoader(){
	// IE kann offenbar keine "richtigen" Klassen -> Kein Support von ECMAScript 2015...
	this._data = [];
	this._conntected = false;

	this.init = function(api, cb){

		var obj = this;

		jQuery.getJSON(api, function( data ) {
			// alert(data.data[1].body[0].Cluster);
			obj.setData(data);
			obj._conntected = true;

			if(cb !== undefined) cb(data);
		});
	};

	this.isConnected = function(){
		return this._conntected;
	};

	this.setData = function (data){
		this._data = data;
	};

	this.getData = function(){
		return this._data;
	};

	return this;
}