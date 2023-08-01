// Add earthquake data to the map
function addEarthquakesToMap(data) {
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
    // Map magnitude values to colors
    function getColor(mag) {
      return mag < 1 ? '#1a9850' :
             mag < 2 ? '#91cf60' :
             mag < 3 ? '#d9ef8b' :
             mag < 4 ? '#fee08b' :
                       '#f46d43';
    }
  
    // Generate legend HTML
    function createLegend() {
      const legend = L.control({ position: 'bottomright' });
  
      legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const magnitudes = [0, 1, 2, 3, 4]; // Modify the magnitude thresholds as needed
        const labels = [];
  
        for (let i = 0; i < magnitudes.length; i++) {
          div.innerHTML += '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + (magnitudes[i + 1]) + '<br>' : '+');
        }
  
        return div;
      };
  
      legend.addTo(map);
    }
  
    // Loop through the features and add markers to the map
    data.features.forEach(feature => {
      const lat = feature.geometry.coordinates[1];
      const lng = feature.geometry.coordinates[0];
      const mag = feature.properties.mag;
      const title = feature.properties.title;
  
      // Create a circle marker for each earthquake with its magnitude as the radius
      const radius = mag * 10; 
  
      L.circleMarker([lat, lng], {
        radius: radius,
        fillColor: getColor(mag), 
        color: '#555',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(title).addTo(map);
    });
  }
  
  // Function to fetch earthquake data and process it
  function fetchAndProcessEarthquakeData() {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
    fetch(url)
      .then(response => response.json())
      .then(data => {
        addEarthquakesToMap(data);
      })
      .catch(error => console.error('Error fetching earthquake data:', error));
  }
  
  document.addEventListener('DOMContentLoaded', fetchAndProcessEarthquakeData);
  