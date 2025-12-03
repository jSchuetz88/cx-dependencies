let CX = {};
CX.Standards = {}

// Prepare data for usage
CX.Standards.Manager = {
	_data : Array(),
	_isReady : false,

	init : function(dataset, ready = false){
		CX.Standards.Manager._data = dataset;

		for (var cxId of Object.keys(dataset)){
			CX.Standards.Manager._data[cxId] = new Standard(cxId, dataset[cxId]);
		}

		CX.Standards.Manager._isReady = ready;
	},

	addDependencies : function(dataset, ready = true){
		for (var cxId of Object.keys(dataset)){
			CX.getStandard(cxId).setDependencies(dataset[cxId]);
		}

		CX.Standards.Manager._isReady = ready;
	},

	onReady : async function(cb){
		if(!CX.Standards.Manager._isReady){
			await sleep(100);
			CX.Standards.Manager.onReady(cb);
		}else{
			cb();
		}		
	}
}

// Shortcuts
CX.getStandard = function(cxId){
	return CX.Standards.Manager._data[cxId];
}

CX.getAllStandards = function(filter = 'default'){
	switch(filter){
		case "onlyValid":
			var filtered = {};
			for (const key in CX.Standards.Manager._data) {
				if (!CX.getStandard(key).isDeprecated()) {
					filtered[key] = CX.Standards.Manager._data[key];
				}
			}
			return filtered;
		break;
		default: 
			return CX.Standards.Manager._data;	
		break;
	}
}

// Interfaces
function Standard(cxId, dataset){
	// IE kann offenbar keine "richtigen" Klassen -> Kein Support von ECMAScript 2015...
	this._id = cxId;
	this._data = dataset;
	this._dependencies = new Dependencies();

	this.getName = function(){
		return this._data.title;
	};

	this.getCategory = function(){
		return this._data.category;
	};

	this.getURL = function(){
		return this._data.url;
	};

	this.getDependencies = function(){
		return this._dependencies;
	};

	this.setDependencies = function(dependencies){
		this._dependencies.set(dependencies);
	};

	this.isDeprecated = function(){
		return this._data.status == 0 ? true : false;
	};
}

function Dependencies(){
	this._dependencies = null;

	this.set = function(dependencies){
		this._dependencies = dependencies;
	};

	this.getReferences = function($type){
		return this._dependencies[$type];
	};

	this.getAllReferences = function(){
		return this._dependencies['normative'].concat(this._dependencies['non-normative']);
	};

	/*
	this.getSemantics = function(){
		return this._dependencies['aspect-models'];
	};

	this.getNormativeReferences = function(){
		return this._dependencies['normative'];
	};

	this.getNonNormativeReferences = function(){
		return this._dependencies['non-normative'];
	};
	*/
}