      
var geocoder;
var map;
var marker;
    
function initialize(){
//MAP
  var latlng = new google.maps.LatLng(39.94431,-95.0448);
  var options = {
    zoom: 3,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
        
  map = new google.maps.Map(document.getElementById("map_canvas"), options);
        
  //GEOCODER
  geocoder = new google.maps.Geocoder();
        
  marker = new google.maps.Marker({
    map: map,
    draggable: true
  });
				
}
		
$(document).ready(function() { 
         
  initialize();


  $(function() {
    $("#address").autocomplete({
      //This bit uses the geocoder to fetch address values
	  delay: 300, 
	  position: { my: "left top", at: "right bottom"},
      source: function(request, response) {
        geocoder.geocode( {'address': request.term , 'bounds': map.getBounds()}, function(results, status) {
          response($.map(results, function(item) {
            return {
              label:  item.formatted_address,
              value: item.formatted_address,
              latitude: item.geometry.location.lat(),
              longitude: item.geometry.location.lng()
            }
          }));
        })
      },
      //This bit is executed upon selection of an address
      select: function(event, ui) {
        $("#latitude").val(ui.item.latitude);
        $("#longitude").val(ui.item.longitude);
        var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
        marker.setPosition(location);
        //map.setCenter(location);
		//map.setZoom(15);
      }
    });
  });
	
  //Add listener to marker for reverse geocoding
  google.maps.event.addListener(marker, 'drag', function() {
    geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#address').val(results[0].formatted_address);
          $('#latitude').val(marker.getPosition().lat());
          $('#longitude').val(marker.getPosition().lng());
        }
      }
    });
  });
  
});
