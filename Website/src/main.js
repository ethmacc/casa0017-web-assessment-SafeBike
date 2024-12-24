import '../front-end/css/style-app.css';
import { BASEMAP } from '@deck.gl/carto';
import { Map, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

import { DataFilterExtension } from '@deck.gl/extensions';

async function main () {
  //Initialise Maplibre BaseMap
  const map = new Map({
    container: 'map',
    style: BASEMAP.POSITRON,
    interactive: true,
    center:[-0.12262486445294093,51.50756471490389],
    zoom: 10
  })

  //wait until map is loaded before loading data
  await map.once('load');

  const colorArea = '../data_processing/bikeTheftDataWithGeometry(color).geojson'
  //still working, working on data processing

  //Data filtering - populate dropdown
  let addArray = []
  await loadJsonAndPopulateDropdown()

  function loadJsonAndPopulateDropdown() {
    fetch(colorArea)
      .then(response => response.json())
      .then(data => {
        const dropdown = document.getElementById('family-dropdown');

        console.log(data);
        data.features.forEach(item => {
          if (item.properties['Borough Name'] && !addArray.includes(item.properties['Borough Name'])) {
            addArray.push(item.properties['Borough Name']);
            const option = document.createElement('option');
            option.value = item.properties['Borough Name'];
            option.textContent = item.properties['Borough Name'];
            dropdown.appendChild(option);
          }
        });
        console.log(addArray);
      })
      .catch(error => console.error('Error loading JSON', error));
  }

  const LSOALayer = new GeoJsonLayer({
    id: 'colorArea',
    data: colorArea, 
    stroked: true, 
    filled: true,
    pickable: true,
    lineWidthMinPixels: 1,
    opacity: 0.3,
    getFilterCategory:d=> d.properties['Borough Name'],
    filterCategories:addArray,
    updateTriggers: {
      filterCategories:addArray
    },
    extensions: [new DataFilterExtension({ categorySize: addArray[0]==='all'? 0:1})],
    getLineColor: [255, 255, 255],
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
        const popup = document.getElementsByClassName('maplibregl-popup');
        if ( popup.length ) {popup[0].remove();} //remove previous popup on open

        new Popup({closeOnClick: false, closeOnMove:true})
            .setLngLat(coordinate)
            .setHTML(description)
            .addTo(map);
        } else {
          console.log('No feature clicked.');
        }
    },
  })
  
  const deckOverlay = new MapboxOverlay({
      interleaved: true,
      layers: [
        LSOALayer,
      ]
  });

  map.addControl(deckOverlay);

  function updateFilter(selectedFamilyValue) {
    addArray=[]
    addArray.push(selectedFamilyValue)

    const LSOALayer = new GeoJsonLayer({
      id: 'colorArea',
      data: colorArea, 
      stroked: true, 
      filled: true,
      pickable: true,
      lineWidthMinPixels: 1,
      opacity: 0.3,
      getFilterCategory:d=> d.properties['Borough Name'],
      filterCategories:addArray,
      updateTriggers: {
        filterCategories:addArray
      },
      extensions: [new DataFilterExtension({ categorySize: addArray[0]==='all'? 0:1})],
      getLineColor: [255, 255, 255],
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
          const popup = document.getElementsByClassName('maplibregl-popup');
          if ( popup.length ) {popup[0].remove();} //remove previous popup on open
  
          new Popup({closeOnClick: false, closeOnMove:true})
              .setLngLat(coordinate)
              .setHTML(description)
              .addTo(map);
          } else {
            console.log('No feature clicked.');
          }
      },
    })

    const newlayers=deckOverlay._deck.props.layers.map(layer => layer.id === 'colorArea' ? LSOALayer : layer);

    deckOverlay.setProps({
      layers: newlayers
    })
  }

  //Dropdown event listener
  document.getElementById('family-dropdown').addEventListener('change', (event) => {
    updateFilter(event.target.value);
  });
}

main();