jQuery(document ).ready(function() {
  new dbLoader().init('./_data/db.json', function(stdset){
    CX.Standards.Manager.init(stdset);

    new dbLoader().init('./_data/r25.09/standards.json', function(depset){
      CX.Standards.Manager.addDependencies(depset);
    });		
  });
});

CX.Standards.Manager.onReady(function(){

  // Dimensionen Generieren -> Zuordnung von Index zu Standard-Id.
  var matrix = {}; // Objekt statt Array

  for (var cxId of Object.keys(CX.getAllStandards('onlyValid'))) {
    matrix[cxId] = {};

    for (var refId of Object.keys(CX.getAllStandards('onlyValid'))) {
      if(CX.getStandard(cxId).getDependencies().getAllReferences().includes(refId)){
        matrix[cxId][refId] = 1;
      }else{
        matrix[cxId][refId] = 0;
      }
    }
    /*
    for (var refId of CX.getStandard(cxId).getDependencies().getReferences('normative')) {
      matrix[cxId][refId] = 1;
    }
      */
  }

  jQuery('#stash944').html( renderCrossTable( matrix ) );
});

function renderCrossTable(matrix) {
  const rowKeys = Object.keys(matrix);
  // Alle möglichen Spaltenkeys sammeln
  const colKeys = Array.from(new Set(rowKeys.flatMap(r => Object.keys(matrix[r]))));

  let html = "<table>";

  // Kopfzeile mit Spaltenkeys
  html += "<tr><th></th>";
  for (const col of colKeys) {
    html += `<th>${col}</th>`;
  }
  html += "</tr>";

  // Zeilen mit RowKey + Werte
  for (const row of rowKeys) {
    html += `<tr><th>${row}</th>`;

    for (const col of colKeys) {
      const val = matrix[row][col] ?? "";
      
      if(row === col){
        html += `<td style="background-color: #d3d3d3;">/</td>`;
      }else{
        if(val === 0){
          html += `<td>${val}</td>`;
        }else{
          html += `<td style="background-color: #f08080;">${val}</td>`;
        }
      }
    }
    html += "</tr>";
  }

  html += "</table>";
  return html;
}
