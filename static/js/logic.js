// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    
  data = data.features

  var sizeScale = d3.scalePow()
        .exponent(2)
        .domain([0, 9])
        .range([0, 1000000])

    var colorScale = d3.scaleSequential()
        .domain([0, d3.max(data.map(q => parseFloat(q.geometry.coordinates[2])))])
        .interpolator(d3.interpolatePlasma)

  var quakes = [];

  data.forEach(q => {
    quakes.push(
      L.circle([q.geometry.coordinates[1], q.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.5,
        color: "white",
        fillColor: colorScale(q.geometry.coordinates[2]),
        radius: sizeScale(q.properties.mag)
      })
    );
    })
  
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  
  var earthquakes = L.layerGroup(quakes);

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [darkmap, earthquakes]
  });
  

});