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
        id: 'colorArea',
        data: colorArea, 
        stroked: true, 
        filled: true,
        pickable: true,
        lineWidthMinPixels: 2,
        opacity: 0.7,
        getFillColor: d => {
          if (d.properties && d.properties.color) {
            const color = d.properties.color;
            const match = color.match(/\d+/g); 
            if (match) {
              const rgba = match.map(Number); 
              rgba.push(200); 
              return rgba;
            }
          }
          return [255, 255, 255,200];
        },
        beforeId: 'place_suburbs',
        // onHover: info => {
        //   const {coordinate,object} = info;
        //   if(object){map.getCanvas().style.cursor = 'pointer';}
        //   else{map.getCanvas().style.cursor = 'grab';}
        // },
        onClick: (info) => {
          const {coordinate, object} = info;
          if (object) {
            const properties = object.properties || {};
            const description = `
              <div>
                <h5>SafeBike Information</h5>
                <p><strong>LSOA Name:</strong> ${properties['LSOA Name']}</p>
                <p><strong>LSOA Code:</strong> ${properties['LSOA Code']}</p>
                <p><strong>Total Cases:</strong> ${properties['Total']}</p>
              </div>`;

          //MapLibre Popup
            new Popup({closeOnClick: false, closeOnMove:true})
                .setLngLat(coordinate)
                .setHTML(description)
                .addTo(map);
            } else {
              console.log('No feature clicked.');
            }
        },
      }),
      
    ]
  })
}

main();