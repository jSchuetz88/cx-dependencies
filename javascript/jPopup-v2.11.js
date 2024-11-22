jPopup = {
	_isOpen : false,
	_isInit : false,
	_doClose : true,
	_cb : false,

	alert : function(op){
		this._open();

		this._doClose = (op.close == undefined ? true : false);
		this._setTitle(op.title);
		this._setClass(op.class);
		this._setContent(op.content+'<hr />'
			+'<div class="controls"><button onClick="javascript:jPopup._callback(true);">'+(op.btnSubmitValue == undefined ? 'Bestätigen' : op.btnSubmitValue)+'</button></div>'
		);
		this._setCallback(op);
	},

	confirm : function(op){
		this._open();

		this._doClose = (op.close == undefined ? true : false);
		this._setTitle(op.title);
		this._setClass(op.class);
		this._setContent(op.content+'<hr />'
			+'<div class="controls">'
			+'<button onClick="javascript:jPopup._callback(true);">'+(op.btnSubmitValue == undefined ? 'Bestätigen' : op.btnSubmitValue)+'</button> '
			+'<button onClick="javascript:jPopup._callback(false);">'+(op.btnDenyValue == undefined ? 'Abbrechen' : op.btnDenyValue)+'</button>'
			+'</div>'
		);
		this._setCallback(op);
	},

	prompt : function(op){
		this._open();

		this._setTitle('');
		this._setClass('');
		this._setContent('');
		this._setCallback('');
	},

	_callback : function(res){
		switch(typeof(this._cb)){
			case 'object':
				if(res != false){
					if(typeof(this._cb.accept) == 'function'){
						this._cb.accept();
					}
				}else{
					if(typeof(this._cb.denied) == 'function'){
						this._cb.denied();
					}
				}
			break;
		}

		this._close();
	},

	_open : function(){
		if(this._isOpen == false){
			if(this._isInit == false){
				this._show();
			}

			this._isOpen = true;

			jQuery('#jPopup').fadeToggle();
		}
	},

	_close : function(){
		if(this._isOpen != false && this._doClose != false){
			this._isOpen = false;

			jQuery('#jPopup').fadeToggle();
		}else{
			this._isOpen = true;
			this._doClose = true;
		}
	},

	_show : function(){
		this._isInit = true;

		var add = document.createElement("div");

		jQuery(add).attr('id', 'jPopup');
		jQuery(add).html('<div>'
				+'<div class="close" onClick="jPopup._close();"></div>'
				+'<div class="title"></div>'
				+'<div class="content"></div>'
			+'</div>');

		jQuery('div').first().before(add);
	},

	_setClass : function(cl){
		jQuery('#jPopup').addClass(cl);
	},

	_setTitle : function(title){
		jQuery('#jPopup .title').text(title);
	},

	_setContent : function(content, type){
		jQuery('#jPopup .content').html(content);
	},

	_setCallback : function(callback){
		this._cb = callback;
	}
};