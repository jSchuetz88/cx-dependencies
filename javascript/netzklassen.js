var Dashboard = {};
Dashboard.Netzklassen = {
	init : function(refId){
		jQuery('#el-3dviz').removeAttr('src');
		
		jQuery.get('/api/dashboard/d3viz/?kpi='+refId).done(function(res){
			data = jQuery.parseJSON(res);
			jQuery('#el-3dviz').attr('src', data.path);
		});
	},
}