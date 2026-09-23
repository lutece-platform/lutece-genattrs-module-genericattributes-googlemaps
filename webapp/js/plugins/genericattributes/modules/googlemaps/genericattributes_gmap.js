if ( typeof(geocoders) == 'undefined' )
{
	var geocoders = new Array(  );
}

if ( typeof(gmapCallbacks) == 'undefined' )
{
	var gmapCallbacks = new Array(  );
}

/**
 * Load the Google Maps API once for the page, then run the callback
 * @param key the Google Maps JavaScript API key
 * @param callback the function to run once the API is loaded
 * @return nothing
 */
function gmap_load( key, callback )
{
	if ( window.google && window.google.maps && window.google.maps.Map )
	{
		callback(  );
		return;
	}
	gmapCallbacks.push( callback );
	if ( document.getElementById( "genericattributes-gmap-api" ) )
	{
		return;
	}
	var script = document.createElement( "script" );
	script.id = "genericattributes-gmap-api";
	script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent( key ) + "&callback=gmap_api_ready";
	script.async = true;
	document.head.appendChild( script );
}

/**
 * Run the callbacks waiting for the Google Maps API
 * @return nothing
 */
function gmap_api_ready(  )
{
	while ( gmapCallbacks.length > 0 )
	{
		gmapCallbacks.shift(  )(  );
	}
}

function gmap_genericattributes( x, y, field_id, button_text ) 
{
	geocoders[field_id] = new google.maps.Geocoder(  );
	var ZOOM = 14;
	var X = document.getElementById(field_id + "_x");
	var Y = document.getElementById(field_id + "_y");

	if( X.value.length > 0 )
	{
		x = parseFloat( X.value.replace( ",", "." ) );
	}
	else
	{
		X.value = x;
	}

	if( Y.value.length > 0 )
	{
		y = parseFloat( Y.value.replace( ",", "." ) );
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
	
	var address = document.getElementById( field_id + "_address" );
	var button = document.createElement( "button" );
	var icon = document.createElement( "i" );
	icon.className = "ti ti-search me-1";
	icon.setAttribute( "aria-hidden", "true" );
	button.appendChild( icon );
	button.appendChild( document.createTextNode( button_text ) );
	button.type = "button";
	button.id = field_id + "_gmap_button";
	button.className = "btn btn-primary btn-sm mt-2";
	if ( address )
	{
		address.parentNode.appendChild( button );
	}
	button.addEventListener( "click", function () {
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
		x = parseFloat( X.value.replace( ",", "." ) );
	}
	else
	{
		X.value = x;
	}

	if( Y.value.length > 0 )
	{
		y = parseFloat( Y.value.replace( ",", "." ) );
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