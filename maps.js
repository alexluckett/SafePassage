//var citymap = getMap();
var map;
var heatmap;
var infoWindow = new google.maps.InfoWindow();


function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 52.48659000000001, lng: -1.8910500000000001}
    });



    directionsDisplay.setMap(map);

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

	
    
    //document.getElementById('start').addEventListener('change', onChangeHandler);
    //document.getElementById('end').addEventListener('change', onChangeHandler);
    document.getElementById("clicky").addEventListener('click', onChangeHandler);
}

function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
      }

      function changeGradient() {
        var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ]
        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
      }

      function changeRadius() {
        heatmap.set('radius', heatmap.get('radius') ? null : 20);
      }

      function changeOpacity() {
        heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
      }


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: 'WALKING'
    }, function (response, status) {
        directionsDisplay.setDirections(response);

        $.ajax({
            url: "api.php",
            dataType: 'json',
            async: false,
            type: 'POST',
            data: {
                postcodeStart: document.getElementById('start').value,
                postcodeEnd: document.getElementById('end').value
            },
            success: function (result) {
                displayStats(result);
            }
        });
    });
}

function displayStats(stats) {
	var result = new Array();
   	 for (var key in stats) {
        // skip loop if the property is from prototype
        	if (!stats.hasOwnProperty(key)) continue;

        	var obj = stats[key];
		console.log(obj);
		result.push(
			{
			id : parseFloat(obj.lat),
			location: new google.maps.LatLng(parseFloat(obj.lat), parseFloat(obj.lng)),
			weight: 0.5
			});
	}
	console.log(result);
	heatmap = new google.maps.visualization.HeatmapLayer({
          data: result,
          map: map
        });
	
}
