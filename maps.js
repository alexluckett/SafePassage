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
                document.getElementById('start').addEventListener('change', onChangeHandler);
                document.getElementById('end').addEventListener('change', onChangeHandler);
            }




            function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                directionsService.route({
                    origin: document.getElementById('start').value,
                    destination: document.getElementById('end').value,
                    travelMode: 'WALKING'
                }, function (response, status) {
                    directionsDisplay.setDirections(response);

                    var coords = [];

                    var currentRoute = response.routes[0].overview_path;

                    var stats = [];
                    for (var x = 0; x < currentRoute.length; x++) {
                        var pos = new google.maps.LatLng(currentRoute[x].lat(), currentRoute[x].lng());
                        coords.push(pos);
                        stats = getCrimeStats(currentRoute[x].lat(), currentRoute[x].lng(), stats);
                    }

                    displayStats(stats);
                });
            }

            function getCrimeStats(lat, lng, existingStats) {
                var crimeUrl = "https://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng + "2&date=2016-08";

                $.ajax({
                    url: crimeUrl,
                    dataType: 'json',
                    async: false,
                    success: function (result) {
                        existingStats = indexCrimeStats(result, existingStats);
                    }
                });

                return existingStats;
            }

            function indexCrimeStats(json, existingStats) {
                var crimeData = existingStats;

                for (var i = 0; i < json.length; i++) {
                    var id = json[i].id;

                    crimeData[id] = {
                        id: id,
                        category: json[i].category,
                        lat: json[i].location.latitude,
                        lon: json[i].location.longitude,
                        streetName: json[i].location.street.name
                    };
                }

                return crimeData;
            }

            function displayStats(stats) {
                for (var k in stats) {
                    if (stats.hasOwnProperty(k)) {
                        var marker = new google.maps.Marker({
          position: {
                                'lat': parseFloat(stats[k].lat),
                                'lng': parseFloat(stats[k].lon)
                            },
          map: map,
          title: stats[k].category
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

                    }
                }
            }
