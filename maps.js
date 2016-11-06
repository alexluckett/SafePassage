//var citymap = getMap();
var map;
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
    for (var key in stats) {
        // skip loop if the property is from prototype
        if (!stats.hasOwnProperty(key)) continue;

        var obj = stats[key];
        
        var marker = new google.maps.Marker({
            position: {
                'lat': parseFloat(obj.lat),
                'lng': parseFloat(obj.lng)
            },
            map: map,
            title: obj.category
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    }
}
