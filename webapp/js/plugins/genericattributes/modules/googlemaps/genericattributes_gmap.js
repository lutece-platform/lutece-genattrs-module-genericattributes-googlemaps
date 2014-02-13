if ( typeof(geocoders) == 'undefined' )
{
	var geocoders = new Array(  );
}

function gmap_genericattributes( x, y, field_id, button_text ) 
{
	geocoders[field_id] = new google.maps.Geocoder(  );
	var ZOOM = 14;
	var X = document.getElementById(field_id + "_x");
	var Y = document.getElementById(field_id + "_y");

	if( X.value.length > 0 )
	{
		x = eval(X.value.replace(",","."));
	}
	else
	{
		X.value = x;
	}

	if( Y.value.length > 0 )
	{
		y = eval(Y.value.replace(",","."));
	}
	else
	{
		Y.value = y;
	}
	
	if ( x == 0 && y == 0 )
	{
		x = 48.8566667;
		y = 2.3509871;
	}
	var latlng = new google.maps.LatLng( x, y );
	var myOptions = { zoom: ZOOM, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP };
	var map = new google.maps.Map( document.getElementById(field_id + "_gmap"), myOptions );
	var markers = new Array();
	var marker = new google.maps.Marker({ map: map, position: latlng, draggable: true });
	google.maps.event.addListener(map, 'click', function(event) {
		X.value = event.latLng.lat();
		Y.value = event.latLng.lng();
		marker.setPosition(event.latLng);
		// reverse geocoding
		reverse( document.getElementById( field_id + "_address" ), event.latLng, field_id );
	});
	
	google.maps.event.addListener(marker, 'dragend', function(event) {
		X.value = event.latLng.lat();
		Y.value = event.latLng.lng();
		// reverse geocoding
		reverse( document.getElementById( field_id + "_address" ), event.latLng, field_id );
	});
	
	var block = $("#" + field_id + "_address").parent();
	var button = document.createElement("button");
	$(button).append('<i class="icon-search icon-white"></i>&nbsp;' + button_text);
	button.type="button";
	button.id= field_id + "_gmap_button";
	$(button).addClass("btn btn-primary btn-small");
	block.append(button);
	$(button).click(function () {
		var address = document.getElementById( field_id + "_address").value;
		if ( address != null && address != ''){
			geocoders[field_id].geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var latlng = results[0].geometry.location;
					map.setCenter(latlng);
					marker.setPosition( latlng );
					X.value = latlng.lat();
					Y.value = latlng.lng();
				} else {
					alert("Une erreur s'est produite lors de la recherche de la g\u00E9olocalisation");
				}
			});
		}
	});
}

/**
 * Create a map for the given field. Marker is static
 * @param x x field
 * @param y y field
 * @param field_id field id
 * @return nothing
 */
function gmap_view( x, y, field_id ) 
{
	var ZOOM = 14;
	var X = document.getElementById(field_id + "_x");
	var Y = document.getElementById(field_id + "_y");

	if( X.value.length > 0 )
	{
		x = eval(X.value.replace(",","."));
	}
	else
	{
		X.value = x;
	}

	if( Y.value.length > 0 )
	{
		y = eval(Y.value.replace(",","."));
	}
	else
	{
		Y.value = y;
	}
	
	if ( x == 0 && y == 0 )
	{
		x = 48.8566667;
		y = 2.3509871;
	}

	var latlng = new google.maps.LatLng( x, y );
	var myOptions = { zoom: ZOOM, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP };
	var map = new google.maps.Map( document.getElementById(field_id + "_gmap"), myOptions );
	var marker = new google.maps.Marker({ map: map, position: latlng, draggable: false });
}

/**
 * Reverse geocoding
 * @param input the input to fill
 * @param latlng latlng object
 * @return void
 */
function reverse( input, latlng, field_id ) 
{
	displayLoading( field_id );
    if (geocoders[field_id]) {
      geocoders[field_id].geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
        	  input.value = results[0].formatted_address;
          } else {
            alert("Aucune correspondance");
          }
        } else {
          alert("Une erreur s'est produite lors de la recherche de l'adresse");
        }
      });
    }
    hideLoading( field_id );
}

function displayLoading( id_entry )
{
	document.getElementById( id_entry + "_waiting" ).style.display='block';
}

function hideLoading( id_entry )
{
	document.getElementById( id_entry + "_waiting" ).style.display='none';
}