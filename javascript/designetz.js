var Dashboard = {};
Dashboard.Designetz = {
	_chartId : 0,
	
	init : function(refId, chartId){
		this._chartId = parseInt(chartId, 10);;
		var loader = new dbLoader();
		loader.init(refId, this._update);
	},

	_update : function(db){
		var spannungsebene = db.getData(2).body[0].col_3.replace(/HS|MS|NS/gi, function(x){
			return '<span class="'+x+'" title="'+x+'">'+x+'</span>';
		});
		var traeger = '';
		if(db.getData(2).body[0].col_4.indexOf("/") === -1){
			db.getData(2).body[0].col_4.split(", ").forEach(function(x) {
				traeger += '<div class="icon '+x+'" title="'+x+'"></div>';
			});
		}else{
			traeger = "<p class=\"data\">N/A</p>";
		}
		var sektor = '';
		if(db.getData(2).body[0].col_5.indexOf("/") === -1){
			db.getData(2).body[0].col_5.split(", ").forEach(function(x) {
				sektor += '<div class="icon '+x+'" title="'+x+'"></div>';
			});
		}else{
			sektor = "<p class=\"data\">N/A</p>";
		}
		
		jQuery('#el-2').text(db.getData(2).body[0].col_2);
		jQuery('#el-3').html(spannungsebene);
		jQuery('#el-4').html(traeger);
		jQuery('#el-5').html(sektor);
		jQuery('#el-4a').text(db.getData(2).body[0].col_4);
		jQuery('#el-5a').text(db.getData(2).body[0].col_5);


		jQuery('#el-7').text(db.getData(2).body[0].col_7);

		jQuery('#el-8').text(db.getData(2).body[0].col_8);
		jQuery('#el-9').text(db.getData(2).body[0].col_9);
		jQuery('#el-10').text(db.getData(2).body[0].col_10);
		jQuery('#el-11').text(db.getData(2).body[0].col_11);
		jQuery('#el-12').text(db.getData(2).body[0].col_12);
		jQuery('#el-13').text(db.getData(2).body[0].col_13);
		
		jQuery.get('/api/dashboard/d3viz/?kpi='+db.getData(1).body[0].col_5).done(function(res){
			data = jQuery.parseJSON(res);
			jQuery('#el-3dviz').attr('src', data.path);
		});

		var t = new ChartDesignetz("#designetz-map");
		t.init({"allowInteractions": 1});
		t.setView({
			"height": "500px",
			"viewBox": "200 340 930 500",
			"selected": Dashboard.Designetz._chartId
		});
	},

	Legend : {
		traeger : function(){
			jPopup.alert({
				title: 'Legende (Energieträger)',
				content: '<div>'
					+'<div class="icon Strom" style="display: inline-block;"></div> <div style="display: inline-block;vertical-align: top;margin: 12px 8px 0 0;">Strom</div>'
					+'<div class="icon Wärme" style="display: inline-block;"></div> <div style="display: inline-block;vertical-align: top;margin: 12px 8px 0 0;">Wärme</div>'
					+'<div class="icon Gas" style="display: inline-block;"></div> <div style="display: inline-block;vertical-align: top;margin: 12px 8px 0 0;">Gas</div>'
					+'<div class="icon Erdgas" style="display: inline-block;"></div> <div style="display: inline-block;vertical-align: top;margin: 12px 8px 0 0;">Erdgas</div>'
					+'<div class="icon Biogas" style="display: inline-block;"></div> <div style="display: inline-block;vertical-align: top;margin: 12px 8px 0 0;">Biogas</div>'
					+'<div class="icon Grubengas" style="display: inline-block;"></div> <div style="display: inline-block;vertical-align: top;margin: 12px 8px 0 0;">Grubengas</div>&nbsp;</div>'
			});
		},

		sektor : function(){
			jPopup.alert({
				title: 'Legende (Sektorkopplung)',
				content: '<div>'
					+'<img src="/assets/dashboard/images/sektorlegende.png" style="width: 420px;margin-left: 96px;">'
			});
		}

	}
}