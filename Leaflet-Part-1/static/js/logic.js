var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(data) {

// initialize map object
var myMap = L.map("map", {
  center: [
    37.0902, -95.7129
  ],
  zoom: 5
});

  // Function to determine circle color based on the magnitude 
function mapColor(mag){
  switch(true){
    case mag > 5:
      return "#ea2c2c";
    case mag > 4:
      return "#eaa92c";
    case mag > 3:
      return "#d5ea2c";
    case mag > 2:
      return "#92ea2c";
    case mag > 1:
      return "#2ceabf";
    default:
      return "#2c99ea";
  }
}

// Function to determine circle radius based on the magnitude 
function mapRadius(mag){
  if (mag === 0) {
    return 1;
  }
  return mag * 4;
}

function mapStyle(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: mapColor(feature.properties.mag),
    color: "#000000",
    radius: mapRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

L.geoJson(data, {

  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
  },

  style: mapStyle,

  onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

  }}).addTo(myMap);

var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");

  var grades = [0, 1, 2, 3, 4, 5];
  var colors = ["#2c99ea", "#2ceabf", "#92ea2c", "#d5ea2c","#eaa92c", "#ea2c2c"];


// loop through the intervals of colors to put it in the label
  for (var i = 0; i<grades.length; i++) {
    div.innerHTML +=
    "<i style='background: " + colors[i] + "'></i> " +
    grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;

};

legend.addTo(myMap)

// Create the base layers.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);



});