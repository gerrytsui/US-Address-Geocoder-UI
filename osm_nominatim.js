var map;
var poi;
var osmUSAviewportString = '-128.0,49.0,-65.0,25.0';    
function initialize(){
//MAP
  //map = new google.maps.Map(document.getElementById("map_canvas"), options);
  map = new MQA.TileMap({
	elt:document.getElementById('map_canvas'),
	zoom: 3,
	latLng: {lat:39.94431, lng: -95.0448},
	maptype: 'map',
	bestFitMargin:0,
	zoomOnDoubleClick: true
	}
  );
  MQA.withModule('mousewheel', function() {
		map.enableMouseWheelZoom();
	});

        
  poi = new MQA.Poi( { lat:0, lng: 0 } );
  poi.draggable = true;
  poi.setBias({x:50, y:50});
  poi.setInfoTitleHTML('test title');
  poi.setInfoContentHTML('test content');
  map.addShape(poi);
  
}
		
$(document).ready(function() { 
         
  initialize();
  document.getElementById("address").focus();

  setupfunctions(); //jQuery functions
	
  //Add listener to marker for reverse geocoding
  
  MQA.EventManager.addListener(poi,'drag', function() {
	alert ("test");
    $.getJSON(
        "http://nominatim.openstreetmap.org/reverse",
        { format: "json", lat: marker.getPosition().lat(), lon: marker.getPosition().lng(), zoom: "18", addressdetails: "0"
        },
         function(data){
          $('#address').val(data.display_name);
          $('#latitude').val(marker.getPosition().lat());
          $('#longitude').val(marker.getPosition().lng());
         }
    );
  
  }); //add Listener
}); // doc.ready function

function setupfunctions(){ // this get call/overriden on checkboxes changes
  $(function() {
    $("#address").autocomplete({
      //This bit uses the geocoder to fetch address values
      delay: 230, // slow it down. in millisec
      autoFocus: $('input[name=isAutoFocus]').attr('checked'),
      position: { my: "left top", at: "right top"},
      source: function(request, response) {

		if (request.term.length > 3 )
		$.ajax(
			{ url:"http://nominatim.openstreetmap.org/search",
			  data: {
				format: "json", polygon: "0", limit: "25", dedupe: "1", addressdetails: "0",
				viewbox: $('input[name=isUSA]').attr('checked') ?
					  osmUSAviewportString:
					  (map.getBounds().ul.getLongitude() - 0.05) + "," +  (map.getBounds().ul.getLatitude() + 0.05) + "," + (map.getBounds().lr.getLongitude() + 0.05)  + "," +  (map.getBounds().lr.getLatitude() - 0.05 )
						,	
				q: request.term
			  },
			  dataType: "jsonp",
			  jsonp: "json_callback",
			  success:  function(returnarray) {
				response( $.map(returnarray, function(item) {
				 return{
				  label: item.display_name + " (" + item.osm_type + ")", //"test",
				  value: item.display_name,
				  latitude: item.lat,	
				  longitude: item.lon 
				 }
			    }))
		
			  }
			}
		)

      },
      //----------------------------onclick/tab selection of an address
      select: function(event, ui) {
        $("#latitude").val(ui.item.latitude);
        $("#longitude").val(ui.item.longitude);
        //var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
        //marker.setPosition(location);
        map.setZoomLevel(17);
        map.setCenter( { lat: ui.item.latitude , lng:ui.item.longitude}); // " location); map.setZoom(17);
		map.removeShape( poi);
		poi.dispose();
		poi = new MQA.Poi( { lat:  ui.item.latitude, lng:ui.item.longitude  } );
  		poi.draggable = true;
  		//poi.setBias({x:50, y:50});
		map.addShape(poi);


		$('div.thumap').html("<img src='http://www.mapquestapi.com/staticmap/v3/getmap?key=Fmjtd%7Cluu2nu6rnu%2C8w%3Do5-h08l0&center=" +
		   ui.item.latitude + "," + ui.item.longitude + 
		   "&pois=pcenter," + ui.item.latitude + "," + ui.item.longitude +
		   "&size=260,180&zoom=10'>");
        //$('div.thumap').html("<img src='http://maps.googleapis.com/maps/api/staticmap?center=" + ui.item.latitude + "," + ui.item.longitude + 
		//"&zoom=10&size=260x180&sensor=false&markers=size:mid%7C" +  ui.item.latitude + "," + ui.item.longitude + "&maptype=terrain'>");
      },
	  //---------------------------candidate selection via autofocus, arrow keys
      focus: function(event, ui) {
        //$("#latitude").val(ui.item.latitude);
        //$("#longitude").val(ui.item.longitude);
        //var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
		//marker.setPosition(location);
		$('div.thumap').html("<img src='http://www.mapquestapi.com/staticmap/v3/getmap?key=Fmjtd%7Cluu2nu6rnu%2C8w%3Do5-h08l0&center=" +
		  ui.item.latitude + "," + ui.item.longitude + 
		  "&pois=pcenter," + ui.item.latitude + "," + ui.item.longitude +
		  "&size=260,180&zoom=14'>");
		//$('div.thumap').html("<img src='http://maps.googleapis.com/maps/api/staticmap?center=" + ui.item.latitude + "," + ui.item.longitude +
		//"&zoom=14&size=260x180&sensor=false&markers=size:mid%7C" +  ui.item.latitude + "," + ui.item.longitude + "'>");
      }
    });
  });
};
