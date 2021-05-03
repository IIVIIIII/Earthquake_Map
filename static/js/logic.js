var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {

    console.log(data)

  data = data.features

  var sizeScale = d3.scalePow()
        .exponent(2)
        .domain([0, 9])
        .range([0, 1000000])

    var colorScale = d3.scaleSequential()
        .domain(d3.extent(data.map(q => parseFloat(q.geometry.coordinates[2]))))
        .interpolator(d3.interpolatePlasma)

    var limitScale = d3.scaleLinear()
        .domain([0, 7])
        .range(d3.extent(data.map(q => parseFloat(q.geometry.coordinates[2]))))
        

    console.log(d3.extent(data.map(q => parseFloat(q.geometry.coordinates[2]))))

  var quakes = [];

  data.forEach(q => {
    quakes.push(
      L
      .circle([q.geometry.coordinates[1], q.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.5,
        color: "white",
        fillColor: colorScale(q.geometry.coordinates[2]),
        radius: sizeScale(q.properties.mag)
      })
      .bindPopup(`<h5>Location: ${q.properties.place}</h5><h5>Magnitude: ${q.properties.mag}</h5><h5>Depth: ${q.geometry.coordinates[2]}</h5>`)
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


  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = [limitScale(0), limitScale(1), limitScale(2), limitScale(3), limitScale(4), limitScale(5), limitScale(6), limitScale(7), limitScale(8)];
      var colors = [colorScale(limits[0]), colorScale(limits[1]), colorScale(limits[2]), colorScale(limits[3]), colorScale(limits[4]), colorScale(limits[5]), colorScale(limits[6]), colorScale(limits[7]), colorScale(limits[8])];
      var labels = [];

          // Add min & max
  var legendInfo = "<h1>Depth</h1>" +
  "<div class=\"labels\">" +
    "<div class=\"min\">" + limits[0] + "</div>" +
    "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  "</div>";

div.innerHTML = legendInfo;

limits.forEach(function(limit, index) {
  labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
});

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
  };


  legend.addTo(myMap);
  

});