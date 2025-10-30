const map = L.map('map').setView([14.65, 121.03], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// <-- REPLACE this with the public URL of your geojson file on GitHub Pages -->
const geojsonURL = 'https://github.com/HiddenJem22/barangay-map/blob/main/Barangay_Boundary.geojson';

// Color scale: adjust thresholds to your metric
function getColor(value) {
  return value > 100 ? '#800026' :
         value > 50  ? '#BD0026' :
         value > 20  ? '#E31A1C' :
         value > 10  ? '#FC4E2A' :
         value > 5   ? '#FD8D3C' :
                       '#FEB24C';
}

function styleFeature(feature) {
  const val = feature.properties.ProjectCount || feature.properties.projects || 0;
  return {
    fillColor: getColor(val),
    weight: 1,
    color: '#333',
    fillOpacity: 0.7
  };
}

fetch(geojsonURL)
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: styleFeature,
      onEachFeature: (feature, layer) => {
        const name = feature.properties.Barangay || feature.properties.name || feature.properties.BRGY || 'Unknown';
        const val = feature.properties.ProjectCount || feature.properties.projects || 0;
        layer.bindPopup(`<strong>${name}</strong><br>Value: ${val}`);
      }
    }).addTo(map);
    // fit bounds
    const layer = L.geoJSON(data);
    map.fitBounds(layer.getBounds());
  })
  .catch(err => {
    console.error('Error loading GeoJSON:', err);
    document.getElementById('map').innerHTML = '<p style="padding:12px">Error loading GeoJSON. Check console.</p>';

  });
