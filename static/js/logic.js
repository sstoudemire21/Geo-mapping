// create map
var myMap = L.map("map-id", {
  center: [37.09, -95.71],
  zoom: 4
});

// Set color array for magnitude

var colors = ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26","#a50f15"]

function getColor(magnitude){
  if (magnitude < 1){
    color = colors[0];
  } else if (magnitude >= 1 && magnitude < 2){
    color = colors[1];
  } else if (magnitude >= 2 && magnitude < 3){
    color = colors[2];
  } else if (magnitude >= 3 && magnitude < 4){
    color = colors[3];
  } else if (magnitude >= 4 && magnitude < 5){
    color = colors[4];
  } else {
    color = colors[5];
  }
  return color;
}
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    accessToken: API_KEY
  }).addTo(myMap);

// Store our API endpoint inside queryUrl
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url, function(data) {
  var features = data["features"];

//Loop through the data and create markers for each earthquake,
//bind popup containing magnitude, depth, time and color based on magnitude
for (var i = 0; i < features.length; i++) {
  var geometry = features[i]["geometry"]["coordinates"];
  var place = features[i]["properties"]["place"]
  var magnitude = features[i]["properties"]["mag"];
  var title = features[i]["properties"]["title"];
  var coords = {
    long: geometry["0"],
    lat: geometry["1"]
  };
    //   var city = cities[i];
    var latlng = L.latLng(coords.lat, coords.long);
    var circle = L.circle(latlng, {
      color: getColor(magnitude),
      fillOpacity: 0.50,
      radius: magnitude * 20000
    }).addTo(myMap);

    L.circle(latlng)
      .bindPopup("Place: " + place + ":" + "Magnitude: " + magnitude)
      .addTo(myMap);
}

//Set up legend in bottom right
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap){
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5];
    div.innerHTML = '<h3>Magnitude</h3>'

// Loop through our intervals and generate a label with a color square for each interval
  for (var i = 0; i < grades.length; i++){
    div.innerHTML +=
      '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i>' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
  }
  return div;
};

legend.addTo(myMap);

});



