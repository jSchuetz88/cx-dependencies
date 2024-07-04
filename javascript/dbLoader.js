function dbLoader(){
	// IE kann offenbar keine "richtigen" Klassen -> Kein Support von ECMAScript 2015...
	this._data = [];
	this._loaded = false;

	this.init = function(id, op){
		var obj = this;
		
		jQuery.get('/api/dashboard/loaddata/?kpi='+id).done(function(res){
			// alert(data.data[1].body[0].Cluster);
			// alert(res);
			obj.setData(jQuery.parseJSON(res).data);
			obj._loaded = true;
			if(op !== undefined) op(obj);
		});
	};

	this.isReady = function(){
		return this._loaded;
	};

	this.setData = function (data){
		this._data = data;
	};

	this.getData = function(index){
		return this._data[index];
	};
}