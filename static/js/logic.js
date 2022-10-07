

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  //Marker size
  function getRadius(mag) {
    return mag * 2
  }

  function getColor(feature) {
    let mydepth = feature.geometry.coordinates[2];
    let mycolor = "white";
    if (mydepth > 90) { mycolor = "red" }
    else if (mydepth > 70) { mycolor = "blue" }
    else if (mydepth > 50) { mycolor = "green" }
    else if (mydepth > 30) { mycolor = "purple" }
    else if (mydepth > 10) { mycolor = "yellow" }
    return (mycolor)
  }


  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><br>Magnitude: ${(feature.properties.mag)}<br>Depth: ${(feature.geometry.coordinates[2])}</p>`);
  }

  function pointToLayer(feature, latlng) {
    return new L.CircleMarker(latlng,
      {
        radius: getRadius(feature.properties.mag),
        color: '#222',
        fillColor: getColor(feature),
        fillOpacity: 1,
        weight: 1
      }
    );
  }

  // onEachFeature function 
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };


  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [36.00, -94.20],
    zoom: 4,
    layers: [street, earthquakes]
  });

  // Create a layer
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create legend
  var legend = L.control({ position: "bottomleft" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #white"></i><span>&lt;10</span><br>';
    div.innerHTML += '<i style="background: #yellow"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: #purple"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #green"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: #blue"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: #red"></i><span>&gt;90</span><br>';
    return div;
  };

  legend.addTo(myMap);
}



































