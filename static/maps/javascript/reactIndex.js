function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class App extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "newMap", async () => {
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';
      const response = await fetch('/api/all_helps', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({
          'data': 'all'
        })
      });
      const data = await response.json();
      let mapConfig = {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [data.longitude, data.latitude] // starting position

      };
      mapConfig.zoom = data.user ? 14 : 1;
      const map = new mapboxgl.Map(mapConfig);
      map.addControl(new mapboxgl.NavigationControl()); // Geolocalizacion

      const track = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
      map.addControl(track, 'top-left'); //Fullscreen

      map.addControl(new mapboxgl.FullscreenControl(), 'top-left'); // Agregando puntos

      let features = [];
      data.points.forEach(point => {
        let newPoint = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': point.coordinates
          },
          'properties': {
            'title': point.name,
            'category': point.category,
            'organization': point.organization,
            'description': point.description,
            'rute': point.rute,
            'uuid': point.uuid
          }
        };
        features.push(newPoint);
      });
      map.on('load', () => {
        //Change Lenguage
        map.setLayoutProperty('country-label', 'text-field', ['get', "name_es"]); //Points

        map.loadImage('/static/maps/images/point.png', (error, image) => {
          if (error) throw error;
          map.addImage('pointer', image);
          map.addSource('points', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': features
            }
          });
          map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'pointer',
              'icon-size': 1,
              // get the title name from the source's "title" property
              'text-field': ['get', 'title'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.2],
              'text-anchor': 'top'
            }
          });
        });
      }); // Change the cursor to a pointer when the mouse is over the places layer.

      map.on('mouseenter', 'points', function () {
        map.getCanvas().style.cursor = 'pointer';
      }); // Change it back to a pointer when it leaves.

      map.on('mouseleave', 'points', function () {
        map.getCanvas().style.cursor = '';
      });
      map.on('click', 'points', e => {
        let properties = e.features[0].properties;
        this.changeState(properties.title, properties.category, properties.organization, properties.description, properties.rute, properties.uuid);
      });
    });

    _defineProperty(this, "changeState", (name, type, organization, description, url, uuid) => {
      this.setState({
        name: name,
        type: type,
        organization: organization,
        description: description,
        url: url,
        uuid: uuid
      });
    });

    this.state = {
      name: "¡Bienvenido a Small Actions!",
      type: 'Web de ayuda',
      organization: 'Small Actions',
      description: "Bienvenido a Small Actions una página web sobre ayudar a los demás, para iniciar, da click en un sitio en el mapa de tu izquierda, esta sección cambiará con la información del lugar, y los botones de abajo te llevarán a páginas con más información o con la ruta para visitar el lugar. Por favor haz una cuenta antes de nada para guardar tu progreso. ¡Ayuda a los demás y gana puntos!.",
      url: "/info/about_us",
      uuid: "/info/about_us"
    };
    this.newMap();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "info_point"
    }, /*#__PURE__*/React.createElement("div", {
      id: "non_button"
    }, /*#__PURE__*/React.createElement("h1", null, this.state.name), /*#__PURE__*/React.createElement("div", {
      id: "grid_info"
    }, /*#__PURE__*/React.createElement("h6", null, "Categoria:"), /*#__PURE__*/React.createElement("h6", null, this.state.type), /*#__PURE__*/React.createElement("h6", null, "Organizaci\xF3n:"), /*#__PURE__*/React.createElement("h6", null, this.state.organization)), /*#__PURE__*/React.createElement("p", null, this.state.description)), /*#__PURE__*/React.createElement("div", {
      id: "button"
    }, /*#__PURE__*/React.createElement("a", {
      href: this.state.uuid
    }, /*#__PURE__*/React.createElement("button", {
      id: "more_info"
    }, "Informaci\xF3n")), /*#__PURE__*/React.createElement("a", {
      href: this.state.url
    }, /*#__PURE__*/React.createElement("button", {
      id: "view_rute"
    }, "Ver Ruta"))));
  }

}

;
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('react'));