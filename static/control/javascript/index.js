
const Place = (props) => {
    return (
        <div className="place">
            <div onClick={() => props.to_hover(props.uuid)}>
                <img src={props.image} />
                <h5>{props.name}</h5>
            </div>
            <div className="conf">
                { props.hover ? <div>
                    <i className="fas fa-eye" onClick={() => window.open(props.url, '_blank')} />
                    <i className="fas fa-edit"/>
                    <i className="fas fa-barcode" />
                    <i className="fas fa-trash" onClick={() => props.delete(props.name, props.uuid)}/>
                </div> : null }
            </div>
        </div>
    )
};

const Popup = (props) => {
    return (
        <div id="popupDelete">
            <h3>¿Estas seguro que quieres eliminar {props.name}?</h3>
            <button id="buttonYes" onClick={() => props.delete(props.uuid)}>Si</button>
            <button id="buttonNo" onClick={props.see}>No</button>
        </div>
    )
};


class Principal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'places' : [],
            'popupSee' : false,
            'popup' : null
        };
        this.getPlaces();
    }

    getPlaces = async () => {
        const for_data = await fetch('/control/api/places');
        const data = await for_data.json();

        this.setState({'places' : data.places});
    }

    changeHover = (uuid) => {
        const index = this.state.places.findIndex(item => item.uuid === uuid);
        let places = [...this.state.places];
        let place = {...places[index]};
        places.forEach(place => place.hover = false);

        place.hover = !place.hover;
        places[index] = place;

        this.setState({'places' : places});
    }

    setNoPopup = () => {
        this.setState({'popupSee' : false});
    }

    deleteToServer = async (uuid) => {
        const for_data = await fetch('/control/api/delete', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({'uuid' : uuid})
        });
        const data = await for_data.json();
        
        if (data.message != undefined) {
            const index = this.state.places.findIndex(item => item.uuid === uuid);
            let places = [...this.state.places];
            places.splice(index, 1);
            this.setState({'places' : places, 'popupSee' : false});
        };
    }

    deletePlace = (name, uuid) => {
        this.setState({'popup' : 
        <div id='popupParent'>
            <Popup name={name} uuid={uuid} see={this.setNoPopup} delete={this.deleteToServer}/>
            <div id="background"></div>
        </div>,

        'popupSee' : true})
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
                    <div id="places">
                        {this.state.places.map(place => {
                            return <Place name={place.name} image={place.image} url={place.url} hover={place.hover} to_hover={this.changeHover} 
                            delete={this.deletePlace} uuid={place.uuid} key={place.uuid}/>
                        })}
                    </div>
                </div>
                {this.state.popupSee ? this.state.popup : null}
            </div>
        )
    }
};

ReactDOM.render(<Principal />, document.getElementById('react'));