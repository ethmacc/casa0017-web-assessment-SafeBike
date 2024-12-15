import '../front-end/css/style-app.css'
import { BASEMAP } from '@deck.gl/carto';
import { Map, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';

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
const LSOA21 = '../data_processing/lsoa21.geojson'

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

//still working, working on data processing
const BIKETHEFDATA = ''
deckOverlay.setProps({
  layers: [
    ...deckOverlay._props.layers,
    new GeoJsonLayer({
      id: 'label',
      data:BIKETHEFDATA,
      onHover: info => {
        const {coordinate, object} = info;
        if(object){map.getCanvas().style.cursor = 'pointer';}
        else{map.getCanvas().style.cursor = 'grab';}
      },
    onClick: (info) => {
        console.log(info);
        const {coordinate, object} = info;
        let population=object.properties.pop_max;
        population= population.toLocaleString(); 
        const description = `working`;    
        //MapLibre Popup
        new Popup({closeOnClick: false, closeOnMove:true})
            .setLngLat(coordinate)
            .setHTML(description)
            .addTo(map);
      },
    })
  ]
})
