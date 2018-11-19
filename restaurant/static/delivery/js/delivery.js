var geoResults = {};
var geocoder;
var map;
var searchResults = [];
var markers = [];
var endAddr = [];


$(function(){
    setInterval(function () {
        // path = /delivery/<order_id>/map
        var url = window.location.pathname;
        var id = url.split("/")[2];
        $.ajax({

            type: "GET",
            url: "/delivery/" + id + "/eta",
            dataType: "json",
            success: function (response) {
                // set the target marker
                var end = response.final_destination;
                console.log(end)
                if (endAddr.length < 1) {
                    endAddr.push(end);
                    geocodeAddress(end);
                }

                
                // display statusbar
                // display status
                var status = response.status;
                var eta = response.eta.current.val;
                var totalTime = response.eta.total.val;
                if (markers.length > 0 ) {
                    var markerLat = (markers[markers.length - 1]).getPosition().lat().toFixed(6);
                    var markerLng = (markers[markers.length - 1]).getPosition().lng().toFixed(6);
                }
                var responseLat = parseFloat(response.lat).toFixed(6);
                var responseLng = parseFloat(response.lng).toFixed(6);
                var percent = parseInt((1 - (eta / totalTime)) * 100)
                $('#msg').css("display", "block").html("status: " + status)
                $('#prog-bar').css("width", percent + "%");
                $('#progress-text').html(percent + "%")
                if (markerLat === responseLat && markerLng == responseLng){
                    console.log("markers have the same position")
                }else{
                    setNewMarker(response.lat, response.lng)
                }
                
            },
            error: function (error) {
            console.log("1. something went wrong (GET)");
            console.log(error);
            }
        });
    }, 4000);
});



function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(58.9556, 5.8644);
    var myOptions = {
        zoom: 8,
        center: latlng,
    }
    map = new google.maps.Map(document.getElementById('map'), myOptions);
}

function removePrevMarker() {
    for (i=0 ; i < markers.length-1 ; i++) {
        markers[i].setMap(null);
    }
}


function setNewMarker(lat, lng){
    var latlng = new google.maps.LatLng(lat, lng);
    searchResults.push(latlng);
    var car = {
        url: 'http://maps.google.com/mapfiles/kml/shapes/cabs.png',
        scaledSize: new google.maps.Size(20, 20),
    };
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: car
    });

    markers.push(marker);
    removePrevMarker();
}


function geocodeAddress(address) {
  geocoder.geocode({ address: address }, function(results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      var flag = {
        url: "http://maps.google.com/mapfiles/kml/shapes/flag.png",
        scaledSize: new google.maps.Size(20, 20)
      };
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        icon: flag
      });
    }
  });
}   