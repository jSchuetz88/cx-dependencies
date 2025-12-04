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
  }

  jQuery('#stash944').html( renderCrossTable( matrix ) );

  // Onboarding
  moveCrossTableId('CX-0006', 2);
  moveCrossTableId('CX-0009', 3);

    // BPDM
  moveCrossTableId('CX-0010', 4);
  moveCrossTableId('CX-0012', 5);
  moveCrossTableId('CX-0053', 6);
  moveCrossTableId('CX-0074', 7);
  moveCrossTableId('CX-0076', 8);

  // EDC
  moveCrossTableId('CX-0001', 9);
  moveCrossTableId('CX-0018', 10);
  moveCrossTableId('CX-0152', 11);

  // Wallet
  moveCrossTableId('CX-0049', 12);
  moveCrossTableId('CX-0050', 13);
  moveCrossTableId('CX-0149', 14);

  // DT / IC
  moveCrossTableId('CX-0002', 15);
  moveCrossTableId('CX-0003', 16);
  moveCrossTableId('CX-0005', 17);
  moveCrossTableId('CX-0044', 18);
  moveCrossTableId('CX-0045', 19);
  moveCrossTableId('CX-0126', 20);
  moveCrossTableId('CX-0157', 21);
  moveCrossTableId('CX-0151', 22);

  moveCrossTableId('CX-0055', 23);
  moveCrossTableId('CX-0007', 24);

  // Ontologies
  moveCrossTableId('CX-0067', 25);
  moveCrossTableId('CX-0084', 26);

  moveCrossTableId('CX-0014', 27);
  moveCrossTableId('CX-0015', 28);
  moveCrossTableId('CX-0054', 29);
  moveCrossTableId('CX-0102', 30);

  // VAS
  moveCrossTableId('CX-0077', 63);
  moveCrossTableId('CX-0078', 64);
  moveCrossTableId('CX-0079', 65);
  moveCrossTableId('CX-0080', 66);
  moveCrossTableId('CX-0081', 67);
  moveCrossTableId('CX-0116', 68);

  moveCrossTableId('CX-0059', 30);
  moveCrossTableId('CX-0156', 55);

  jQuery('#xxx342').prepend(
    '<tr>'+
      '<th colspan="3"></th>'+
      '<th colspan="2">Onboarding</th>'+
      '<th colspan="5">BPDM</th>'+
      '<th colspan="3">Connector</th>'+
      '<th colspan="3">Wallet</th>'+
      '<th colspan="7">DT / Industry Core</th>'+
      '<th colspan="2">/</th>'+
      '<th colspan="2">Ontologies</th>'+
    '</tr>'
  );

  jQuery('#xxx342').prepend(
    '<tr>'+
      '<th colspan="3"></th>'+
      '<th colspan="13">Network Services</th>'+
      '<th colspan="11">Semantics / Integration</th>'+
      '<th colspan="4" rowspan="2">/</th>'+
      '<th colspan="29" rowspan="2">Use Cases</th>'+
      '<th colspan="7" rowspan="2">Value Added Services</th>'+
    '</tr>'
  );

  jQuery("#xxx342 tr[data-cxId='CX-0006']").prepend('<th class="ax" rowspan="2"><span>Onboarding</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0010']").prepend('<th class="ax" rowspan="5"><span>BPDM</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0001']").prepend('<th class="ax" rowspan="3"><span>Connector</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0049']").prepend('<th class="ax" rowspan="3"><span>Wallet</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0002']").prepend('<th class="ax" rowspan="7"><span>DT / Industry Core</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0055']").prepend('<th class="ax" rowspan="2"><span><span>/</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0067']").prepend('<th class="ax" rowspan="2"><span>Ontologies</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0014']").prepend('<th class="ax" rowspan="4" colspan="2"><span>/</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0105']").prepend('<th class="ax" rowspan="29" colspan="2"><span>Use Cases</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0077']").prepend('<th class="ax" rowspan="6" colspan="2"><span>Value Added Services</span></th>');

  jQuery("#xxx342 tr[data-cxId='CX-0006']").prepend('<th class="ax" rowspan="13"><span>Network Services</span></th>');
  jQuery("#xxx342 tr[data-cxId='CX-0002']").prepend('<th class="ax" rowspan="11"><span>Semantics / Integration</span></th>');

  /*
  jQuery('#xxx342').prepend(
    '<tr>'+
      '<th></th>'+
      '<th rowspan="13">Network Services</th>'+
      '<th rowspan="11">Semantics / Integration</th>'+
      '<th rowspan="4" colspan="2">/</th>'+
      '<th rowspan="29" colspan="2">Use Cases</th>'+
      '<th rowspan="7" colspan="2">Value Added Services</th>'+
    '</tr>'
  );
  */

  jQuery("#xxx342 td[data-refId='CX-0009']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0076']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0152']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0149']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0007']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0084']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0102']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0156']").css("border-right-color", "#666");
  jQuery("#xxx342 td[data-refId='CX-0116']").css("border-right-color", "#666");
 
  jQuery("#xxx342 tr[data-cxId='CX-0009'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0076'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0152'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0149'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0151'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0007'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0084'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0102'] td").css("border-bottom-color", "#666");
  jQuery("#xxx342 tr[data-cxId='CX-0156'] td").css("border-bottom-color", "#666");

  $("table td")
    .on("mouseenter", function() {
      var cxId = jQuery(this).data('refid');
      jQuery('td[data-refId="' + cxId + '"]').addClass('highlight');
    })
    .on("mouseleave", function() {
      var cxId = jQuery(this).data('refid');
      jQuery('td[data-refId="' + cxId + '"]').removeClass('highlight');
    });
});

function renderCrossTable(matrix) {
  const rowKeys = Object.keys(matrix);
  // Alle möglichen Spaltenkeys sammeln
  const colKeys = Array.from(new Set(rowKeys.flatMap(r => Object.keys(matrix[r]))));

  let html = `<table id="xxx342">`;

  // Kopfzeile mit Spaltenkeys
  html += `<tr><th colspan="3"></th>`;
  for (const col of colKeys) {
    html += `<th data-cxId="${col}">${col}</th>`;
  }
  html += "</tr>";

  // Zeilen mit RowKey + Werte
  for (const row of rowKeys) {
    html += `<tr data-cxId="${row}"><th>${row}</th>`;

    for (const col of colKeys) {
      const val = matrix[row][col] ?? "";
      
      if(row === col){
        html += `<td data-refId="${col}" style="background-color: #d3d3d3;">/</td>`;
      }else{
        if(val === 0){
          html += `<td data-refId="${col}">${val}</td>`;
        }else{
          html += `<td data-refId="${col}" style="background-color: #f08080;">${val}</td>`;
        }
      }
    }
    html += "</tr>";
  }

  html += "</table>";
  return html;
}

function moveCrossTableId(id, newIndex) {
    var $table = $("table"); // deine Tabelle
    var $rows = $table.find("tr");

    newIndex += 2;

    // --- Zeile verschieben ---
    var $rowToMove = $rows.filter('[data-cxId="' + id + '"]');
    if ($rowToMove.length === 0) return;

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= $rows.length) newIndex = $rows.length - 1;

    if (newIndex === 0) {
        $rowToMove.prependTo($table);
    } else {
        $rowToMove.insertAfter($rows.eq(newIndex - 1));
    }

    // --- Spaltenindex ermitteln ---
    var $firstRow = $rows.first();
    var $firstCells = $firstRow.children("th, td");
    var $colCell = $firstCells.filter('[data-cxId="' + id + '"]').first();
    var currentColIndex = $firstCells.index($colCell);
    if (currentColIndex === -1) return;

    // --- Spalte verschieben ---
    $table.find("tr").each(function () {
        var $cells = $(this).children("th, td");
        var $cellToMove = $cells.eq(currentColIndex);
        if ($cellToMove.length === 0) return;

        var targetIndex = Math.max(0, Math.min(newIndex, $cells.length - 1));

        if (targetIndex === 0) {
            $cellToMove.prependTo($(this));
        } else {
            $cellToMove.insertAfter($cells.eq(targetIndex - 1));
        }
    });
}