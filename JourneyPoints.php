<?php
function retrievJson($originLat, $originLong, $destLat, $destLong){
  $json = file_get_contents('https://maps.googleapis.com/maps/api/directions/json?origin='. $originLat . ',' . $originLong .'&destination=' . $destLat . ',' . $destLong . '&key=AIzaSyBvxMW1WgYO6sGw_HQpENPeQNylG5EAXl0');
  $data = json_decode($json,true);
  return $data;
}

function GetJourneyPoints($originLatitude, $originLongitude, $destLatitude, $destLongitude){
  /* input orgin and destination latitudes and logitudes - AS STRINGS. Returns an array, each element
  of which holds a latitude and logitude of a point along the route.*/

  $data = retrievJson($originLatitude, $originLongitude, $destLatitude, $destLatitude);

  $distanceTraveled = 0;
  $latLongPointsArray = array();

  foreach($data['routes'][0]['legs'][0]['steps'] as $step){
    $distanceTraveled += (int)$step['distance']['value'];

    if($distanceTraveled >= 700){
      $LongLatPoint = array($step['start_location']['lat'], $step['start_location']['lng']);
      array_push($latLongPointsArray, $LongLatPoint);

      $distanceTraveled = 0;
    }
  }
    return $latLongPointsArray;
}
?>
