mapboxgl.accessToken = 'pk.eyJ1IjoiYmVsbGFhcHJtdCIsImEiOiJjbTNtc3RoODAxMGwyMnJzOWtsNjFtcmZwIn0.c9pUs9c9eDUehpXlK90WIA';
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [106.8132037, -6.2258056],
  zoom: 19,
  pitch: 0,
  bearing: 100,
  antialias: true,
  maxZoom: 22,
  minZoom: 18
});

// Disable default map keyboard function
map.keyboard.disable();

map.addControl(new mapboxgl.NavigationControl());
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  })
);

const floors = Array.from({length: 6}, (_, i) => {
  if (i >= 4) {
    return (++i).toString();
  }

  return i === 0 ? 'Ground' : i.toString();
}).reverse();

map.on('load', () => {
  for (var i = 0; i < floors.length; i++) {
    const floor = floors[i];
    map.addLayer({
      'id': `Lantai ${floor}`,
      'type': 'fill',
      'source': {
        type: 'geojson',
        'data': `./F${floor}.geojson`
      },
      layout: {
        visibility: i === (floors.length -1) ? 'visible' : 'none',
      },
      'paint': {
        // Get the `fill-extrusion-color` from the source `color` property.
        'fill-color': ['get', 'colour'],
        'fill-opacity': 0.5
      },
    });
    map.setPaintProperty(`Lantai ${floor}`, 'fill-color', [
      'interpolate',
      // Set the exponential rate of change to 0.5
      ['exponential', 0.5],
      ['zoom'],
      // When zoom is 18, buildings will be beige.
      18,
      '#FFB69C',
      // When zoom is 19 or higher, buildings will be yellow.
      19,
      ['get', 'colour'],
    ]);

  }
});

$(document).ready(function () {
  for (let i = 0; i < floors.length; i++) {
    const floor = floors[i];

    const link = document.createElement('a');
    link.href = '#';
    link.className = `menu-button ${i === (floors.length -1) ? 'active' : ''}`;
    link.setAttribute(`data-nomorlantai`, floor);
    link.id = `btn-lantai-${floor}`;
    link.textContent = `Lantai ${floor}` ;

    link.onclick = function (e) {
      const mapClickedLayer = "Lantai " + this.getAttribute("data-nomorlantai");
      e.preventDefault();
      e.stopPropagation();

      floors.forEach(floor => {
        const floorLayer = `Lantai ${floor}`;
        map.setLayoutProperty(floorLayer, 'visibility', 'none');
      });
      $(".menu-button").removeClass('active');
      $(this).addClass('active');
      map.setLayoutProperty(mapClickedLayer, 'visibility', 'visible');
    };

    const layers = document.getElementById('menu');
    layers.appendChild(link);
  }
})
