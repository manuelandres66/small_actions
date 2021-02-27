
const Place = (props) => {
    return (
        <div>
            <div onMouseEnter={() => props.to_hover(true, props.uuid)} onMouseLeave={() => props.to_hover(false, props.uuid)}>
                <img src={props.image} />
                <h5>{props.name}</h5>
            </div>
            <div>
                { props.hover ? <div>
                    <i class="fas fa-eye"></i>
                    <i class="fas fa-edit"></i>
                    <i class="fas fa-trash"></i>
                </div> : null }
            </div>
        </div>
    )
};


class Principal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'places' : []
        };
        this.getPlaces();
    }

    getPlaces = async () => {
        const for_data = await fetch('/control/api/places');
        const data = await for_data.json();

        this.setState({'places' : data.places});
    }

    changeHover = (to, uuid) => {
        const index = this.state.places.findIndex(item => item.uuid === uuid);
        let places = [...this.state.places];
        let place = {...places[index]};
        place.hover = to;
        places[index] = place;

        this.setState({'places' : places});
    }

    render() {
        return (
            <div>
                <div id="navigation">
                    <h1>Small Actions - Control</h1>
                    <nav>
                        <a>Lugares</a>
                        <a>Organización</a>
                        <a>Ayuda</a>
                    </nav>
                </div>
                <div>
                    <div>
                        {this.state.places.map(place => {
                            return <Place name={place.name} image={place.image} url={place.url} hover={place.hover} to_hover={this.changeHover} uuid={place.uuid} key={place.uuid}/>
                        })}
                    </div>
                </div>
            </div>
        )
    }
};

ReactDOM.render(<Principal />, document.getElementById('react'));