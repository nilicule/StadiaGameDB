        $(document).ready(function() {
            var query = getQueryParams(document.location.search);

	        var stadiaTable = $('#stadiagamedb').DataTable( {
		        "ajax": 'data/gamedb.json',
		        "iDisplayLength": 100,
		        responsive: true,
		        dom: 'Bfrtip',
                stateSave: true,
                buttons: [
                    'columnsToggle'
                ],
		        "columnDefs": [
                    { "searchable": false, "targets": 0 },
                    { "orderable": false, "targets": 0 }
                ]
	        } );

            if (query.filter != null) {
                stadiaTable.search(query.filter).draw();
            }
        } );

        function getQueryParams(qs) {
	        qs = qs.split('+').join(' ');
	        var params = 	{},
    			tokens,
    			re = /[?&]?([^=]+)=([^&]*)/g;

        	while (tokens = re.exec(qs)) {
        		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	        }

        	return params;
        }
