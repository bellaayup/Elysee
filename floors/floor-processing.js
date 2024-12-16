const fs = require('fs');
const turf = require('turf');

const floors = Array.from({length: 6}, (_, i) => {
  if (i >= 4) {
    return (++i).toString();
  }

  return i === 0 ? 'Ground' : i.toString();
});

for (let x = 0; x < floors.length; x++) {
  const floor = floors[x];
  const file = fs.readFileSync(`../F${floor}.geojson`, { encoding: 'utf8', flag: 'r' });
  const fileObject = JSON.parse(file);
  fileObject.features.forEach(feature => {
    if (feature.properties.name.includes('-icons')) {
      return;
    }

    const coordinatesObject = feature.geometry.coordinates;
    const coordinates = coordinatesObject[0];

    if (!coordinates) {
      console.log(`Floor ${floor}. id:`, feature.properties.id);
      return;
    }
    const center = turf.center(turf.polygon(coordinates));
    center.properties = {
      "name": `${feature.properties.id}-icons`,
    };
    fileObject.features.push(center);
  });
  fs.writeFileSync(`../F${floor}.geojson`, JSON.stringify(fileObject));
}