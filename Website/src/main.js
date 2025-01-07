import '../front-end/css/style-app.css';
import { BASEMAP, colorContinuous } from '@deck.gl/carto';
import { Map, Popup,Marker} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';

import { DataFilterExtension } from '@deck.gl/extensions';

import maplibregl from 'maplibre-gl';
import { API_TOKEN } from './config.js';

async function main () {
  document.addEventListener('DOMContentLoaded', () => {
    const guide = document.getElementById('userGuide');
    const startBtn = document.getElementById('startBtn');
    const closeBtn = document.querySelector('.close-btn');
  
    startBtn.onclick = () => {
      guide.style.display = 'none';
    };
  
    closeBtn.onclick = () => {
      guide.style.display = 'none';
    };
  
    window.onclick = (event) => {
      if (event.target === guide) {
        guide.style.display = 'none';
      }
    };
  });
  //Initialise Maplibre BaseMap
  const map = new Map({
    container: 'map',
    style: BASEMAP.POSITRON,
    interactive: true,
    center:[-0.12262486445294093,51.50756471490389],
    zoom: 9
  });

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

  const months = ['202210', '202211', '202212', '202301', '202302', '202303', '202304',
       '202305', '202306', '202307', '202308', '202309', '202310', '202311',
       '202312', '202401', '202402', '202403', '202404', '202405', '202406',
       '202407', '202408', '202409', 'Total']

const LSOALayer = new GeoJsonLayer({
  id: 'colorArea',
  data: colorArea,
  stroked: false,
  filled: true,
  pickable: true,
  autoHighlight: true,
  highlightColor: [255, 0, 0],
  lineWidthMinPixels: 1,
  opacity: 0.3,
  getFilterCategory: d => d.properties['Borough Name'],
  filterCategories: addArray,
  updateTriggers: {
    filterCategories: addArray
  },
  extensions: [new DataFilterExtension({ categorySize: addArray[0] === 'all' ? 0 : 1 })],
  getFillColor: colorContinuous({
    attr: months[24],
    domain: [0, 1, 2, 5, 10, 20, 50, 100],
    colors: 'Geyser'
  }),
  beforeId: 'place_suburbs',
  
  onHover: (info) => {
    const { coordinate, object } = info;
    if (object) {
      const properties = object.properties || {};
      let count_text = properties['Total'] != null ? properties['Total'] : 'No data';

      const description = `
        <div>
          <h5>SafeBike Information</h5>
          <p><strong>LSOA Name:</strong> ${properties['LSOA Name']}</p>
          <p><strong>LSOA Code:</strong> ${properties['LSOA Code']}</p>
          <p><strong>No. of Cases:</strong> ${count_text}</p>
        </div>`;

      const popup = document.getElementsByClassName('maplibregl-popup');
      if (popup.length) {
        popup[0].remove();
      }
      new Popup({ 
        closeOnClick: false, 
        closeOnMove: true,
        closeButton: false })
        .setLngLat(coordinate)
        .setHTML(description)
        .addTo(map);
    } else {
      const popup = document.getElementsByClassName('maplibregl-popup');
      if (popup.length) {
        popup[0].remove();
      }
    }
  }
});

  
  const deckOverlay = new MapboxOverlay({
      interleaved: true,
      layers: [
        LSOALayer,
      ]
  });

  map.addControl(deckOverlay);

  function updateFilter(selectedFamilyValue, month_idx) {
    addArray=[];
    addArray.push(selectedFamilyValue);

    var colormap = colorContinuous({
      attr: months[month_idx],
      domain: [0, 1, 2, 5, 10, 20, 50, 100],
      colors: 'Geyser'
    });

    const LSOALayer = new GeoJsonLayer({
      id: 'colorArea',
      data: colorArea, 
      stroked: false, 
      filled: true,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 0, 0],
      lineWidthMinPixels: 1,
      opacity: 0.3,
      getFilterCategory:d=> d.properties['Borough Name'],
      filterCategories:addArray,
      getFillColor: colormap,
      updateTriggers: {
        filterCategories:addArray,
        getFillColor: colormap,
      },
      extensions: [new DataFilterExtension({ categorySize: addArray[0]==='all'? 0:1})],
      beforeId: 'place_suburbs',
      // onHover: info => {
      //   const {coordinate,object} = info;
      //   if(object){map.getCanvas().style.cursor = 'pointer';}
      //   else{map.getCanvas().style.cursor = 'grab';}
      // },
      onHover: (info) => {
        const { coordinate, object } = info;
        if (object) {
          const properties = object.properties || {};
          let count_text = properties['Total'] != null ? properties['Total'] : 'No data';
    
          const description = `
            <div>
              <h5>SafeBike Information</h5>
              <p><strong>LSOA Name:</strong> ${properties['LSOA Name']}</p>
              <p><strong>LSOA Code:</strong> ${properties['LSOA Code']}</p>
              <p><strong>No. of Cases:</strong> ${count_text}</p>
            </div>`;
    
          const popup = document.getElementsByClassName('maplibregl-popup');
          if (popup.length) {
            popup[0].remove();
          }
          new Popup({ 
            closeOnClick: false, 
            closeOnMove: true,
            closeButton: false })
            .setLngLat(coordinate)
            .setHTML(description)
            .addTo(map);
        } else {
          const popup = document.getElementsByClassName('maplibregl-popup');
          if (popup.length) {
            popup[0].remove();
          }
        }
      }
    })

    const newlayers=deckOverlay._deck.props.layers.map(layer => layer.id === 'colorArea' ? LSOALayer : layer);

    deckOverlay.setProps({
      layers: newlayers
    })
  }

  //Dropdown event listener
  document.getElementById('family-dropdown').addEventListener('change', (event) => {
    const isChecked = document.querySelector('#totalCheck').checked;
    console.log(event.target.value)
    if (isChecked) {
      updateFilter(event.target.value, document.getElementById('monthRange').value);
    }
    else {
      updateFilter(event.target.value, 24);
    }
    //Switch for zooming to fit each borough:
    const borough_zoom = 11
    switch(event.target.value) {
      case 'all': map.flyTo({center: [-0.12262486445294093,51.50756471490389], essential: true, zoom:9}); break;
      case "Barking and Dagenham": map.flyTo({center: [0.134, 51.5541], essential: true, zoom:borough_zoom}); break;
      case "Barnet": map.flyTo({center: [-0.2076, 51.6050], essential: true, zoom:borough_zoom}); break;
      case "Bexley": map.flyTo({center: [0.1172, 51.4519], essential: true, zoom:borough_zoom}); break;
      case "Brent": map.flyTo({center: [-0.2860, 51.5571], essential: true, zoom:borough_zoom}); break;
      case "Bromley": map.flyTo({center: [0.0187, 51.4063], essential: true, zoom:borough_zoom}); break;
      case "Camden": map.flyTo({center: [-0.1426, 51.5390], essential: true, zoom:borough_zoom}); break;
      case "Croydon": map.flyTo({center: [-0.0957, 51.3770], essential: true, zoom:borough_zoom}); break;
      case "Ealing": map.flyTo({center: [-0.3043, 51.5133], essential: true, zoom:borough_zoom}); break;
      case "Enfield": map.flyTo({center: [-0.0807, 51.6523], essential: true, zoom:borough_zoom}); break;
      case "Greenwich": map.flyTo({center: [0.0098, 51.4934], essential: true, zoom:borough_zoom}); break;
      case "Hackney": map.flyTo({center: [-0.0597, 51.5495], essential: true, zoom:borough_zoom}); break;
      case "Hammersmith and Fulham": map.flyTo({center: [-0.2379, 51.5000], essential: true, zoom:borough_zoom}); break;
      case "Haringey": map.flyTo({center: [-0.1033, 51.5905], essential: true, zoom:borough_zoom}); break;
      case "Harrow": map.flyTo({center: [-0.3421, 51.5805], essential: true, zoom:borough_zoom}); break;
      case "Havering": map.flyTo({center: [0.2121, 51.5779], essential: true, zoom:borough_zoom}); break;
      case "Hillingdon": map.flyTo({center: [-0.4481, 51.5352], essential: true, zoom:borough_zoom}); break;
      case "Hounslow": map.flyTo({center: [-0.3632, 51.4704], essential: true, zoom:borough_zoom}); break;
      case "Islington": map.flyTo({center: [-0.1028, 51.5386], essential: true, zoom:borough_zoom}); break;
      case "Kensington and Chelsea": map.flyTo({center: [-0.1938, 51.4991], essential: true, zoom:borough_zoom}); break;
      case "Kingston upon Thames": map.flyTo({center: [-0.3007, 51.4123], essential: true, zoom:borough_zoom}); break;
      case "Lambeth": map.flyTo({center: [-0.1178, 51.4935], essential: true, zoom:borough_zoom}); break;
      case "Lewisham": map.flyTo({center: [-0.0201, 51.4446], essential: true, zoom:borough_zoom}); break;
      case "Merton": map.flyTo({center: [-0.1943, 51.3948], essential: true, zoom:borough_zoom}); break;
      case "Newham": map.flyTo({center: [0.0294, 51.5259], essential: true, zoom:borough_zoom}); break;
      case "Redbridge": map.flyTo({center: [0.0508, 51.5748], essential: true, zoom:borough_zoom}); break;
      case "Richmond upon Thames": map.flyTo({center: [-0.3035, 51.4613], essential: true, zoom:borough_zoom}); break;
      case "Southwark": map.flyTo({center: [-0.0877, 51.5028], essential: true, zoom:borough_zoom}); break;
      case "Sutton": map.flyTo({center: [-0.1940, 51.3614], essential: true, zoom:borough_zoom}); break;
      case "Tower Hamlets": map.flyTo({center: [-0.0347, 51.5251], essential: true, zoom:borough_zoom}); break;
      case "Waltham Forest": map.flyTo({center: [-0.0174, 51.5902], essential: true, zoom:borough_zoom}); break;
      case "Wandsworth": map.flyTo({center: [-0.1891, 51.4584], essential: true, zoom:borough_zoom}); break;
      case "Westminster": map.flyTo({center: [-0.1357, 51.4975], essential: true, zoom:borough_zoom}); break;
    }
  });

  //Slider function on input
  document.getElementById('monthRange').oninput = function() {
    const date = months[document.getElementById('monthRange').value]
    $( "#monthLabel" ).text( date.slice(4) + "/" + date.slice(0, 4));
    updateFilter(document.getElementById('family-dropdown').value, document.getElementById('monthRange').value);
  };

  //Total checkbox function on input
  document.getElementById('totalCheck').oninput = function() {
    const isChecked = document.querySelector('#totalCheck').checked;
    const date = months[document.getElementById('monthRange').value]
    if (isChecked) {
      $( "#monthLabel" ).text( date.slice(4) + "/" + date.slice(0, 4));
      updateFilter(document.getElementById('family-dropdown').value, document.getElementById('monthRange').value);
      document.getElementById("monthRange").disabled = false;
    }
    else {
      $( "#monthLabel" ).text("Currently showing total");
      updateFilter(document.getElementById('family-dropdown').value, 24);
      document.getElementById("monthRange").disabled = true;
    }
    
  }

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
      convertPostcodeToCoords(endLocation)
    .then(coords => {
      if (coords) {
        console.log(coords);
        findBikeParking(coords); 
      } else {
        console.error('Could not find coordinates for the provided postcode.');
      }
    })
    .catch(error => {
      console.error('Error converting postcode to coordinates:', error);
    });
    } else {
      alert('Please enter start and end addresses');
    }
  });

  function convertPostcodeToCoords(postcode) {
    const geocodingUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
  
    return fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200 && data.result) {
          const { latitude, longitude } = data.result;
          return [parseFloat(longitude.toFixed(4)), parseFloat(latitude.toFixed(4))]; 
        } else {
          return null;
        }
      });
  }
  
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
      findBikeParking(end);
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
    removeBikeParkingMarkers();
  }

  // Call ORS API to generate route
  function getRoute(start, end) {
    const orsUrl = `https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${orsApiKey}&start=${start.join(',')}&end=${end.join(',')}`;
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
        map.fitBounds(bounds, { padding: 100 });
      })
      .catch((error) => {
        console.error('Route generation failed:', error);
        alert('Unable to generate route. Please try again later');
      });
  }

  //get bike parking of end address
  let bikeParkingMarkers = [];
  function findBikeParking(coords) {
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:2000,${coords[1]},${coords[0]})[amenity=bicycle_parking];out;`;
    fetch(overpassUrl)
      .then(response => response.json())
      .then(data => {
        // Calculate distance
        const elementsWithDistance = data.elements.map(element => {
          const distance = calculateDistance(coords, [element.lon, element.lat]);
          return { ...element, distance };
        });
        // Sort by distance
        elementsWithDistance.sort((a, b) => a.distance - b.distance);
        // nearest 10
        const nearest10 = elementsWithDistance.slice(0, 10);
        nearest10.forEach(element => {
          const markerEl = document.createElement('div');
          markerEl.className = 'bikeParkingMarker';
          const marker = new Marker({
            element: markerEl,
            anchor: 'bottom' 
          })
            .setLngLat([element.lon, element.lat])
            .addTo(map);
          bikeParkingMarkers.push(marker);
        });
      })
      .catch(error => {
        console.error('Error fetching bike parking data:', error);
      });
  }
  

  function removeBikeParkingMarkers() {
    bikeParkingMarkers.forEach(marker => marker.remove());
    bikeParkingMarkers = [];
  }
  //function to caudate distance
  function calculateDistance(coord1, coord2) {
    const toRad = angle => (angle * Math.PI) / 180;
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}


main();