var json_resp_semantics;
var json_resp_standards;
var json_db;

var requestSemantics = jQuery.ajax({
  url: "./_data/r25.03/semantics.json",
  method: "GET",
  dataType: "json"
});

var requestStandards = jQuery.ajax({
  url: "./_data/r25.03/standards.json",
  method: "GET",
  dataType: "json"
});

var requestDB = jQuery.ajax({
  url: "./_data/db.json",
  method: "GET",
  dataType: "json"
});
 
requestStandards.done(function( json_resp ) {
  json_resp_standards = json_resp;

  if (json_resp_standards && json_resp_semantics && json_db) doStart();
});

requestSemantics.done(function( json_resp ) {
  json_resp_semantics = json_resp;

  if (json_resp_standards && json_resp_semantics && json_db) doStart();
});

requestDB.done(function( json_resp ) {
  json_db = json_resp;

  if (json_resp_standards && json_resp_semantics && json_db) doStart();
});

/*
request.fail(function( jqXHR, textStatus ) {
  jQuery( "#sem_xxx_944" ).html( "Request failed: " + textStatus );
});
*/


function doStart(){
  // 1. transform standards list

  const keys = Object.keys(json_resp_standards);
  var mapping = Array();
  keys.forEach((key, index) => {
    for (var j of Object.keys(json_resp_standards[key]['aspect-models'])){
      if(!mapping[json_resp_standards[key]['aspect-models'][j]]) mapping[json_resp_standards[key]['aspect-models'][j]] = Array();
      mapping[json_resp_standards[key]['aspect-models'][j]].push('<a href="'+json_db[key].url+'">'+key+'</a>');
      // console.log(json_resp_standards[key]['aspect-models'][j]+" : "+key);
    }
  });

  for (var sammId of Object.keys(mapping)){
    for (var samm of json_resp_semantics){
      console.log(samm.id+" == "+sammId);
      if(samm.id == sammId){
        jQuery( "#sem_xxx_944 tbody" ).append('<tr>'
          +'<td>'+samm.id+'</td>'
          +'<td>'+(samm.id.includes('bamm') ? '<span style="color: #FF0000;">BAMM</span>' : 'SAMM')+'</td>'
          +'<td>'+(samm.status.includes('deprecate') ? '<span style="color: #FF0000;">'+samm.status+'</span>' : samm.status)+'</td>'
          +'<td>'+mapping[samm.id].toString().split(','). join(', ')+'</td>'
        +'</tr>');
      }else{
        // jQuery( "#sem_xxx_944" ).append('no match at: '+samm.id+'<br />');        
      }
    }
  }


  /*
  for (var standard of json_resp_standards){
    //if(json_resp_standards[i][1].length > 0){
      //for (var j of Object.keys(json_resp_standards[i][1])){
        jQuery( "#sem_xxx_944" ).append(json_resp_standards[0]+'<br />');
     // }
   // }
  }*/


}
