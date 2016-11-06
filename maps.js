var map;
var heatmap;

// this method based off google's api documentation
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 52.48659000000001, lng: -1.8910500000000001}
    });

    directionsDisplay.setMap(map); // show directions to user (despite later calls to api.php)

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    document.getElementById("clicky").addEventListener('click', onChangeHandler);
}

// apply orange to red gradient for severity
function changeGradient() {
    var gradient = [
        'rgba(255,255,0,0)',
        'rgba(255,240,0,1)',
        'rgba(255,224,0,1)',
        'rgba(255,208,0,1)',
        'rgba(255,192,0,1)',
        'rgba(255,176,0,1)',
        'rgba(255,160,0,1)',
        'rgba(255,144,0,1)',
        'rgba(255,128,0,1)',
        'rgba(255,112,0,1)',
        'rgba(255,96,0,1)',
        'rgba(255,80,0,1)',
        'rgba(255,64,0,1)',
        'rgba(255,64,0,1)',
        'rgba(255,32,0,1)',
        'rgba(255,16,0,1)',
        'rgba(255,00,00,1)'
    ];

    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

// initial directionsService.route(..) taken from google api documentation and dapted.
// gets the directions, applies to map, then forwards start/stop postcode to api.php which
// will then return crime points around the route
// re-calculates route on backend (rather wastefully) but this enables us to use google's web API
// rather than the javascript one, which has more detailed 'steps' which can be used to grab the 
// latitude/longitude over the entire route, coupleed with external crime data
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

// print statistics on screen - currently a heatmap
function displayStats(stats) {
    var result = new Array();
    for (var key in stats) {
        if (!stats.hasOwnProperty(key)) {
            continue;
        }

        var obj = stats[key];
        result.push({
                    id: parseFloat(obj.lat),
                    location: new google.maps.LatLng(parseFloat(obj.lat), parseFloat(obj.lng)),
                    weight: 0.5 // can improve this in future - weightings for 'worse' categories (accessed at obj.category)
                });
    }
    
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: result,
        map: map
    });

    changeGradient(); // use our own gradient - yellow for basic crime, red for most
}