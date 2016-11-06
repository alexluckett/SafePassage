<?php

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

function getCrimeStats($lat, $lng, $existingStats) {
    $crimeUrl = "https://data.police.uk/api/crimes-street/all-crime?lat=$lat&lng=$lng&date=2016-08";
    
    $jsonData = file_get_contents($crimeUrl);
    
    $decodedJson = json_decode($jsonData, true);
    
    $newStats = indexCrimeStats($decodedJson, $existingStats);
    
    return $newStats;  
}

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

$entityBody = file_get_contents('php://input');
$inputCoords = json_decode($entityBody, true);

$existingStats = [];
foreach($inputCoords as $item) {
    $existingStats = getCrimeStats($item['lat'], $item['lng'], $existingStats);
}

echo(json_encode($existingStats));