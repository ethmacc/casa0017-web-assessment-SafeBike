import '../front-end/css/style-app.css';
import { BASEMAP } from '@deck.gl/carto';
import { Map } from 'maplibre-gl';
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
}

main();