

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
            console.log(data)
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [data.longitude, data.latitude], // starting position
                zoom: 13, // starting zoom
            });

            map.addControl(new mapboxgl.NavigationControl());

            const parameters = {
                closeOnClick: true,
                closeButton: false,
            };

            data.points.forEach(point => {
                const popup = new mapboxgl.Popup(parameters).setHTML(`<h3>${point.name}</h3>`);
                popup.on('open', () => {
                    this.changeState(point.name, point.category, point.organization, point.description, point.rute, point.uuid);
                });

                new mapboxgl.Marker({
                    color: '#ff3a3a'
                })
                .setLngLat(point.cordinates)
                .setPopup(popup)
                .addTo(map);
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
            uuid: `/points/info/${uuid}`
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
                <a href={this.state.url} target="_blank"><button id="view_rute">View Rute</button></a>
            </div>
        </div>
      );
    }
};
  
ReactDOM.render(
    <App />,
    document.getElementById('react')
);

const changeProps = () => {
    let app = new App
    app.setState({
        name: "Hi"
    })
}