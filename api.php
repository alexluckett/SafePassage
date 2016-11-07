<?php
require 'config.php';

/* represents a data item for crime. unique by id. plot on map using lat and lng. */
class CrimeDataItem {
    public $id;
    public $category;
    public $lat;
    public $lng;
    public $streetName;
    
    public function __get($property) {
        if (property_exists($this, $property)) {
            return $this->$property;
        }
    }

    public function __set($property, $value) {
        if (property_exists($this, $property)) {
            $this->$property = $value;
        }

        return $this;
    }
}

/* get stats for crime, 1 mile around a latitude and longitude. return appended to $existingStats 
 * which allows filtering duplicates (via the ID property).
 */
function getCrimeStats($lat, $lng, $existingStats) {
    $crimeUrl = "https://data.police.uk/api/crimes-street/all-crime?lat=$lat&lng=$lng&date=2016-08";
    
    $jsonData = file_get_contents($crimeUrl);
    
    $decodedJson = json_decode($jsonData, true);
    
    $newStats = indexCrimeStats($decodedJson, $existingStats);
    
    return $newStats;  
}

/* Get only relevant info from dataset - strip out all else. */
function indexCrimeStats($json, $existingStats) {
    $crimeData = $existingStats;
    
    foreach ($json as $item) {
        $id = $item['id'];
        
        $crimeDataItem = new CrimeDataItem();
        $crimeDataItem->id = $id;
        $crimeDataItem->category = $item['category'];
        $crimeDataItem->lat = $item['location']['latitude'];
        $crimeDataItem->lng = $item['location']['longitude'];
        $crimeDataItem->streetName = $item['location']['street']['name'];
	
        $crimeData[$id] = $crimeDataItem;
    }
    
    return $crimeData;
}

function retrievJson($postcodeStart, $postcodeEnd){
  $json = file_get_contents("https://maps.googleapis.com/maps/api/directions/json?origin=$postcodeStart&destination=$postcodeEnd&key=".API_KEY);
    
  $data = json_decode($json,true);
  return $data;
}

/**
 * Get points along a route from the google maps API, separated by each 200 metres.
 * @param type $postcodeStart
 * @param type $postcodeEnd
 * @return arrayGets
 */
function GetJourneyPoints($postcodeStart, $postcodeEnd){
  /* input orgin and destination latitudes and logitudes - AS STRINGS. Returns an array, each element
  of which holds a latitude and logitude of a point along the route.*/

  $data = retrievJson($postcodeStart, $postcodeEnd);

  $distanceTraveled = 0;
  $latLongPointsArray = array();

  foreach($data['routes'][0]['legs'][0]['steps'] as $step){
    $distanceTraveled += (int)$step['distance']['value'];
    // sets distance between requests to data.gov.uk
    $metersPerCrimeDataRequest = 200;
    if($distanceTraveled >= $metersPerCrimeDataRequest){
      $LongLatPoint = array(
          'lat' => $step['start_location']['lat'], 
          'lng' => $step['start_location']['lng']
        );
      
      array_push($latLongPointsArray, $LongLatPoint);

      $distanceTraveled = 0;
    }
  }
    return $latLongPointsArray;
}

/* take in start and stop postcode, return local crime stats for the route in JSON format */
$journeyPoints = GetJourneyPoints($_REQUEST['postcodeStart'], $_REQUEST['postcodeEnd']);

$existingStats = [];
foreach($journeyPoints as $item) {
    $existingStats = getCrimeStats($item['lat'], $item['lng'], $existingStats);
}

echo(json_encode($existingStats));
