// Map initialize
const map = L.map('map').setView([19.5, 75.5], 6);

// OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Party color function
function getPartyColor(party) {
  if (party === "BJP") return "#FF9933";
  if (party === "INC") return "#0078D7";
  if (party === "NCP") return "#00A651";
  if (party === "SHS") return "#F36F21";
  return "#B0B0B0";
}

// Load data files
Promise.all([
  fetch("data/winners.json").then(res => res.json()),
  fetch("data/mh_ac_sample.geojson").then(res => res.json())
]).then(([winners, geoData]) => {

  const winnerMap = {};
  winners.forEach(item => {
    winnerMap[item.ac_name] = item;
  });

  // Add GeoJSON to map
  L.geoJSON(geoData, {
    style: feature => {
      const data = winnerMap[feature.properties.ac_name];
      return {
        fillColor: data ? getPartyColor(data.party) : "#ccc",
        weight: 1,
        color: "#000",
        fillOpacity: 0.7
      };
    },
    onEachFeature: (feature, layer) => {
      const data = winnerMap[feature.properties.ac_name];
      if (data) {
        layer.bindPopup(
          `<b>${data.ac_name}</b><br>
           Winner: ${data.winner}<br>
           Party: ${data.party}<br>
           Votes: ${data.votes}`
        );
      }
    }
  }).addTo(map);

});
