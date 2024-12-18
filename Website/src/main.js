import '../front-end/css/style-app.css';
import { BASEMAP } from '@deck.gl/carto';
import { Map, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

async function main () {
  //Initialise Maplibre BaseMap
  const map = new Map({
    container: 'map',
    style: BASEMAP.POSITRON,
    interactive: true,
    center:[-0.12262486445294093,51.50756471490389],
    zoom: 12
  })

  //wait until map is loaded before loading data
  await map.once('load');

  //set lsoa geojson
  const LSOA21 = '../lsoa21.geojson'

  const deckOverlay = new MapboxOverlay({
      interleaved: true,
      layers: [
          new GeoJsonLayer({
              id: 'lsoa-map', 
              data: LSOA21, 
              // Styles
              stroked: true,
              filled: false,
              lineWidthMinPixels: 1,
              opacity: 0.5,
              getLineColor: [252, 148, 3],
              beforeId: 'place_suburbs' 
            }),
      ]
  });

  map.addControl(deckOverlay);

  const colorArea = '../data_processing/bikeTheftDataWithGeometry(color).geojson'
  //still working, working on data processing
  deckOverlay.setProps({
    layers: [
      ...deckOverlay._props.layers,
      new GeoJsonLayer({
        id: 'base-map', // Every layer needs a unique ID
        data: colorArea, // Replace with the path or variable holding the GeoJSON data
        // Styles
        stroked: true, // Keep the border line
        filled: true,  // Enable fill color
        lineWidthMinPixels: 2,
        opacity: 0.7,
        getLineColor: [0, 0, 0], // Static black border
        getFillColor: d => {
          // Parse color data from the GeoJSON properties
          if (d.properties && d.properties.color) {
            const color = d.properties.color; // e.g., "rgb(255, 0, 0)"
            const match = color.match(/\d+/g); // Extract RGB values
            if (match) {
              return match.map(Number); // Convert to [R, G, B]
            }
          }
          return [255, 255, 255]; // Default to white if no color is provided
        },
        beforeId: 'place_suburbs', // Render under the map's labels
        onHover: info => {
          const {coordinate, object} = info;
          map.getCanvas().style.cursor = object ? 'pointer' : 'grab';
        },
        onClick: info => {
          const {coordinate, object} = info;
          if (object) {
            const properties = object.properties;
            const fields = Object.entries(properties)
              .map(([key, value]) => `<p><strong>${key}:</strong> ${value || 'No Data'}</p>`)
              .join('');
            new Popup({closeOnClick: false, closeOnMove: true})
              .setLngLat(coordinate)
              .setHTML(`<div><h3>Feature Information</h3>${fields}</div>`)
              .addTo(map);
          }
        },
      }),
      
    ]
  })
}

main();