class Principal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'places' : [],
            'popupSee' : false,
            'popup' : null,
            'see' : 'places',
            'form' : {
                'mayor_category' : 'D',
                'category' : 10,
                'sub_category' : 71,
                'latitude' : 0,
                'longitude' : 0
            },
            'formError' : null
        };
        this.getPlaces();
    }

    getPlaces = async () => {
        const for_data = await fetch('/control/api/places');
        const data = await for_data.json();

        this.setState({'places' : data.places});
    }

    setSeeTo = (to) => {
        to == 'new' ? this.setState({'see' : to}, this.showMap) : this.setState({'see' : to}); //Callback if showMap is needed
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

    setNoPopup = (interval=null) => {
        if (interval != null) {
            clearInterval(interval);
        };

        this.setState({'popupSee' : false});
    }

    deleteToServer = async (uuid) => {
        const for_data = await fetch('/control/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : getCookie('csrftoken')
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
            <PopupDelete name={name} uuid={uuid} see={this.setNoPopup} delete={this.deleteToServer}/>
            <div id="background"></div>
        </div>,

        'popupSee' : true})
    }

    ban = async (notificationId) => {
        await fetch('/control/api/ban', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : getCookie('csrftoken')
            },
            body: JSON.stringify({'id' : notificationId})
        });
    }

    discardNotify = async (id, aproved) => {
        await fetch('/control/api/checknotify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : getCookie('csrftoken')
            },
            body: JSON.stringify({'id' : id, 'aproved' : aproved})
        });
    }

    getCode = async (intervalCode, name, uuid) => {
        const for_data = await fetch('/control/api/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : getCookie('csrftoken')
            },
            body: JSON.stringify({'uuid' : uuid})
        });
        const data = await for_data.json();

        if (data.code != undefined) {
            this.setState({'popup' : 
            <div id='popupParent'>
                <PopupCode name={name} uuid={uuid} see={() => this.setNoPopup(intervalCode)} code={data.code} 
                notifications={data.notifications} discard={this.discardNotify} ban={this.ban}/>
                <div id="background"></div>
            </div>,
    
            'popupSee' : true});
        }
    }

    showCode = (name, uuid) => {
        var intervalCode = setInterval(() => this.getCode(intervalCode, name, uuid), 2000); //Renew Code
        this.getCode(intervalCode, name, uuid); //For not wait 2 seconds
    }

    setValueForm = (event) => { //Set value to state, in order to submit later
        let data = {...this.state.form};
        data[event.target.name] = event.target.value;
        this.setState({'form' : data});
    }

    newPlaceSubmit = async (event) => { //Most large function, sorry dude
        event.preventDefault();
        let photoIds = []; //To save the ids of the uploaded photos
        const dataSubmit = {...this.state.form};

        //Doing Checks
        let checked = true;
        if (dataSubmit.latitude === 0 & dataSubmit.longitude === 0) { //Not coordinates entered
            checked = false;
            this.setState({'formError' : 'Se nececita poner unas coordenadas'});
        };

        //Categories checks
        const categoryContent = document.querySelector(`#id_category option[value="${dataSubmit.category}"]`).textContent;
        const subContent = document.querySelector(`#id_sub_category option[value="${dataSubmit.sub_category}"]`).textContent;
        if (dataSubmit.mayor_category != categoryContent[0] || categoryContent.slice(0,3) != subContent.slice(0,3)) {
            checked = false;
            this.setState({'formError' : 'Categorias Incorrectas'});
        }


        if (checked) {
            const fileFields = document.querySelectorAll("#newPlace input[type='file']");

            for (let i = 0; i < fileFields.length; i++) { //Upload every new photo
                const file = fileFields[i].files[0];
                if (file != undefined) {
                    const formPhoto = new FormData();
                    formPhoto.append('photo', file);
                    formPhoto.append("csrfmiddlewaretoken", getCookie('csrftoken')) // I hate this
    
                    const for_data = await fetch('/control/api/uploadphoto', {
                        method: 'POST',
                        body: formPhoto
                    });
                    const data = await for_data.json();
    
                    if (data.error !== undefined) {
                        this.setState({'formError': data.error});
                    } else {
                        photoIds.push(data.id);
                    };
                };
            };

            let formPlace = new FormData();
            formPlace.append("csrfmiddlewaretoken", getCookie('csrftoken')) // I hate this

            for (const key in dataSubmit) { //Append all the info
                formPlace.append(key, dataSubmit[key]);
            };

            photoIds.forEach(photo => {
                formPlace.append('photos', photo); //All the photos send like the same "photos"
            });

            const for_data = await fetch('/control/api/uploadplace', {
                method: 'POST',
                body: formPlace
            });
            const data = await for_data.json();
            
            if (data.error !== undefined) { //If error show error
                this.setState({'formError': data.error});
            } else {
                this.getPlaces(); //Get the new place
                this.setState({'formError': null, 'see' : 'places'}); //No error message and see place
            };
        }
        
    }

    dontShowCategories = (event) => {
        const mayor_category = event.target.value === 'D' ? 'V' : 'D'; //Return the contrary
        let categories = document.querySelectorAll('#id_category option');
        categories.forEach(category => {
            if (category.textContent[0] == mayor_category) {
                category.setAttribute('hidden', '');
            } else {
                category.removeAttribute('hidden');
            };
        });
    }

    dontShowSubCategories = (event) => {
        const category = document.querySelector(`#id_category option[value="${event.target.value}"]`).textContent.slice(0,3); //Get the code of the category (like DAl)
        let sub_categories = document.querySelectorAll('#id_sub_category option');
        sub_categories.forEach(sub_category => {
            if (sub_category.textContent.slice(0, 3) == category) {
                sub_category.removeAttribute('hidden');
            } else {
                sub_category.setAttribute('hidden', '');
            };
        });
    }

    showMap = () => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

        const map = new mapboxgl.Map({
            container: 'map', //No exist yet I really dont know hot to solve this
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0], // starting position
            zoom: 1, // starting zoom
        });

        map.addControl( //Add search bar
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false
            })
        );

        var marker = new mapboxgl.Marker({}); //Only to not get error

        map.on('click', (e) => {
            marker.remove(); //Delete current marker

            const coordinates = e.lngLat.wrap();
            marker = new mapboxgl.Marker()
            .setLngLat([coordinates.lng, coordinates.lat])
            .addTo(map);

            //Add to info state
            let formInfo = {...this.state.form};
            formInfo.latitude = coordinates.lat.toFixed(8);
            formInfo.longitude = coordinates.lng.toFixed(8);

            this.setState({'form' : formInfo});
        });

    }

    render() {
        let see = null;

        if (this.state.see === "places") {
            see = (<div>
                <div id="add" onClick={() => this.setSeeTo('new')}>Añadir Nuevo <i className="fas fa-plus"></i></div>
                <div>
                    <div id="places">
                        {this.state.places.map(place => {
                            return <Place name={place.name} image={place.image} url={place.url} hover={place.hover} to_hover={this.changeHover} 
                            delete={this.deletePlace} uuid={place.uuid} forCode={this.showCode} key={place.uuid}/>
                        })}
                    </div>
                </div>
                {this.state.popupSee ? this.state.popup : null}</div>);

        } else if (this.state.see === "new") {
            see = (<div>
                <h1 id="createTitle">Crear un nuevo lugar</h1>
                <FormPlaces submit={this.newPlaceSubmit} setValue={this.setValueForm} dontShowCate={this.dontShowCategories} 
                dontShowSub={this.dontShowSubCategories} error={this.state.formError}/>
            </div>);
        };

        return (
            <div>
                <div id="navigation">
                    <h1>Small Actions - Control</h1>
                    <nav>
                        <a onClick={() => this.setSeeTo('places')}>Lugares</a>
                        <a>Organización</a>
                        <a>Ayuda</a>
                    </nav>
                </div>
                {see}
            </div>
        )
    }
};

ReactDOM.render(<Principal />, document.getElementById('react'));