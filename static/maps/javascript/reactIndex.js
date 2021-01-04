

class App extends React.Component {
    constructor (props){
        super(props)
        this.state = {
            name: "Welcome to Small Actions!",
            type: 'Help Web',
            organization: 'Small Actions',
            description: "Lorem ipsum dolor sit amet consectetur adipiscing, elit aenean nisl litora donec, blandit sociosqu venenatis ad sollicitudin. Congue nunc non diam morbi posuere, venenatis torquent quis conubia. Rutrum blandit felis praesent cubilia euismod tortor cras, non massa duis proin fusce lacus metus, ultricies primis varius urna penatibus iaculis. Scelerisque ornare iaculis molestie vehicula nec morbi ultricies dictumst, sagittis velit sodales facilisis orci enim primis tortor vestibulum, penatibus litora cum conubia tellus platea ullamcorper. Dapibus inceptos lectus nulla vitae ligula lacinia interdum sem quisque dictum faucibus, tempor eleifend nam phasellus conubia enim mauris ut morbi praesent. Volutpat aliquam nibh conubia turpis quam primis fames, montes iaculis sollicitudin nisl magna accumsan, pellentesque gravida aptent vestibulum nisi lectus. Parturient lectus fringilla inceptos tellu.",
            url: "#",
            uuid: "#"
        };
        this.newMap()
    }


    newMap = () => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

        fetch('/api/all_helps', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({'data': 'all'})
        })
        .then(response => response.json())
        .then(data => {

            let mapConfig = {
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [data.longitude, data.latitude], // starting position
            }

            mapConfig.zoom = (data.user ? 14 : 1);

            const map = new mapboxgl.Map(mapConfig);
            map.addControl(new mapboxgl.NavigationControl());
            
            // Geolocalizacion
            const track =  new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
            });
            map.addControl(track, 'top-left');

            //Fullscreen
            map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

            const parameters = {
                closeOnClick: true,
                closeButton: false,
            };

            // Agregando puntos

            let features = [];
            data.points.forEach(point => {
                let newPoint = {
                    'type': 'Feature',
                    'geometry' : {
                        'type': 'Point',
                        'coordinates': point.cordinates,
                    },
                    'properties': {
                        'title': point.name,
                        'category' : point.category,
                        'organization' : point.organization,
                        'description' : point.description,
                        'rute' : point.rute,
                        'uuid' : point.uuid
                    }
                };
                features.push(newPoint);
            });

            map.on('load', () => {
                map.loadImage(
                    '/static/maps/images/point.png',
                    (error, image) => {
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
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                'text-offset': [0, 1.2],
                                'text-anchor': 'top'
                            }
                        });
                    });
            });

            map.on('click', 'points', (e) => {
                let properties = e.features[0].properties;
                this.changeState(properties.title, 
                    properties.category, 
                    properties.organization,
                    properties.description, 
                    properties.rute, 
                    properties.uuid
                );
            });
        })
    };

    changeState = (name, type, organization, description, url, uuid) => {
        this.setState({
            name: name,
            type: type,
            organization: organization,
            description: description,
            url: url,
            uuid: uuid
        });
    };

    render() {
      return (
        <div id="info_point">
            <div id="non_button">
                <h1>{this.state.name}</h1>
                <div id="grid_info">
                    <div className="info_grid">
                        <h6>Type:</h6>
                        <h6>Organization:</h6>
                    </div>
                    <div className="info_grid" id="info_type">
                        <h6>{this.state.type}</h6>
                        <h6>{this.state.organization}</h6>
                    </div>
                </div>
                <p>{this.state.description}</p>
            </div>

            <div id="button">
                <a href={this.state.uuid}><button id="more_info">More Info</button></a>
                <a href={this.state.url}><button id="view_rute">View Rute</button></a>
            </div>
        </div>
      );
    }
};
  
ReactDOM.render(
    <App />,
    document.getElementById('react')
);