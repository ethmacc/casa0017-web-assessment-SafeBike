import '../front-end/css/style-app.css';
import { BASEMAP, colorBins, colorContinuous } from '@deck.gl/carto';
import { Map, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

import { DataFilterExtension } from '@deck.gl/extensions';

import maplibregl from 'maplibre-gl';
import { API_TOKEN } from './config.js';

async function main () {
  //Slider function, adapted from JQuery demo code
  var startMonthIdx = 0;
  var endMonthIdx = 23;
  $( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 1,
      max: 24,
      values: [ 1, 24 ],
      slide: function( event, ui ) {
        $( "#date_range" ).val( "Month " + ui.values[ 0 ] + " - Month " + ui.values[ 1 ] );
        startMonthIdx = ui.values[0] - 1;
        endMonthIdx = ui.values[1] - 1;
      }
    });
    $( "#date_range" ).val( "Month " + $( "#slider-range" ).slider( "values", 0 ) +
      " - Month " + $( "#slider-range" ).slider( "values", 1 ) );
  } );

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

  //Add data
  const colorArea = '../data_processing/lsoa21.geojson'
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
    stroked: false, 
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
    getFillColor: colorContinuous({
      attr: 'Total',
      domain: [0, 5, 10, 20, 50, 100, 200],
      colors: 'Geyser'
    }),
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
      stroked: false, 
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
      getFillColor: colorContinuous({
        attr: 'Total',
        domain: [0, 5, 10, 20, 50, 100, 200],
        colors: 'Geyser'
      }),
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

  const orsApiKey = API_TOKEN;
  let start = null;
  let end = null;
  let startMarker = null;
  let endMarker = null;

  // Listen for input box button click events
  document.getElementById('routeButton').addEventListener('click', () => {
    const startLocation = document.getElementById('startLocation').value;
    const endLocation = document.getElementById('endLocation').value;

    if (startLocation && endLocation) {
      geocodeAndRoute(startLocation, endLocation);
    } else {
      alert('Please enter start and end addresses');
    }
  });

  // Geocode and generate route
  function geocodeAndRoute(startLocation, endLocation) {
    const geocodeUrl = (query) =>
      `https://api.openrouteservice.org/geocode/search?api_key=${orsApiKey}&text=${query}`;

    Promise.all([fetch(geocodeUrl(startLocation)), fetch(geocodeUrl(endLocation))])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((results) => {
        const startResult = results[0].features[0]?.geometry?.coordinates;
        const endResult = results[1].features[0]?.geometry?.coordinates;

        if (!startResult || !endResult) {
          alert('Unable to find start or end points. Please check the entered addresses');
          return;
        }

        clearRouteAndMarkers();
        addMarker(startResult, 'start');
        addMarker(endResult, 'end');

        getRoute(startResult, endResult);
      })
      .catch((error) => {
        console.error('Geocoding failed:', error);
        alert('Geocoding failed. Please check the addresses or try again later');
      });
  }

  // Set start and end points by clicking on the map
  let isSettingStart = true;

  map.on('click', (e) => {
    const { lng, lat } = e.lngLat;

    if (isSettingStart) {
      clearRouteAndMarkers();
      start = [lng, lat];
      updateInput(start, 'start');
      addMarker(start, 'start');
      isSettingStart = false;
    } else {
      end = [lng, lat];
      updateInput(end, 'end');
      addMarker(end, 'end');
      isSettingStart = true;
    }

    if (start && end) {
      getRoute(start, end);
    }
  });

  // Reverse geocode and update input box
  function updateInput(coords, type) {
    const reverseGeocodeUrl = `https://api.openrouteservice.org/geocode/reverse?api_key=${orsApiKey}&point.lon=${coords[0]}&point.lat=${coords[1]}`;

    fetch(reverseGeocodeUrl)
      .then(response => response.json())
      .then((data) => {
        const address = data.features[0]?.properties?.label || 'Unknown location';

        if (type === 'start') {
          document.getElementById('startLocation').value = address;
        } else {
          document.getElementById('endLocation').value = address;
        }
      })
      .catch((error) => {
        console.error('Reverse geocoding failed:', error);
        alert('Unable to resolve location. Please try again later');
      });
  }

  // Function to add markers
  function addMarker(coords, type) {
    const el = document.createElement('div');
    el.className = type === 'start' ? 'start-marker' : 'end-marker';

    const marker = new maplibregl.Marker(el).setLngLat(coords).addTo(map);

    if (type === 'start') {
      startMarker = marker;
    } else {
      endMarker = marker;
    }
  }

  // Clear old markers, route, and inputs
  function clearRouteAndMarkers() {
    if (startMarker) startMarker.remove();
    if (endMarker) endMarker.remove();

    startMarker = null;
    endMarker = null;
    start = null;
    end = null;

    document.getElementById('startLocation').value = '';
    document.getElementById('endLocation').value = '';

    if (map.getSource('route')) {
      map.removeLayer('route-layer');
      map.removeSource('route');
    }
  }

  // Call ORS API to generate route
  function getRoute(start, end) {
    const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=${start.join(',')}&end=${end.join(',')}`;

    fetch(orsUrl)
      .then(response => response.json())
      .then((data) => {
        const route = data.features[0].geometry;

        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route
          }
        });

        map.addLayer({
          id: 'route-layer',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#007cbf',
            'line-width': 5
          }
        });

        const bounds = new maplibregl.LngLatBounds();
        route.coordinates.forEach(coord => {
          bounds.extend(coord);
        });
        map.fitBounds(bounds, { padding: 300 });
      })
      .catch((error) => {
        console.error('Route generation failed:', error);
        alert('Unable to generate route. Please try again later');
      });
  }
}


main();