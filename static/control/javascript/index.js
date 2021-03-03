
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
                    <i className="fas fa-chart-line"></i>
                    <i className="fas fa-barcode" />
                    <i className="fas fa-trash" onClick={() => props.delete(props.name, props.uuid)}/>
                </div> : null }
            </div>
        </div>
    )
};

const PopupDelete = (props) => {
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
        this.fileInput = [React.createRef(), React.createRef(), React.createRef(), React.createRef()];
        this.getPlaces();
    }

    getPlaces = async () => {
        const for_data = await fetch('/control/api/places');
        const data = await for_data.json();

        this.setState({'places' : data.places});
    }

    setSeeTo = (to) => {
        this.setState({'see' : to})
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
            <PopupDelete name={name} uuid={uuid} see={this.setNoPopup} delete={this.deleteToServer}/>
            <div id="background"></div>
        </div>,

        'popupSee' : true})
    }

    setValueForm = (event) => { //Set value to state, in order to submit later
        let data = {...this.state.form};
        data[event.target.name] = event.target.value;
        this.setState({'form' : data});
    }

    newPlaceSubmit = async (event) => { //More large ecuation, sorry dude
        event.preventDefault();
        let photoIds = []; //To save the ids of the uploaded photos
        const dataSubmit = {...this.state.form};

        //Doing Checks
        let checked = true;
        if (dataSubmit.latitude === 0 & dataSubmit.longitude === 0) { //Not coordinates entered
            checked = false;
            this.setState({'formError' : 'Se nececita poner unas coordenadas'});
        };

        if (checked) {
            const fileFields = document.querySelectorAll("#newPlace input[type='file']");

            for (let i = 0; i < fileFields.length; i++) { //Upload every new photo
                const file = fileFields[i].files[0];
                const formPhoto = new FormData();
                formPhoto.append('photo', file);
                formPhoto.append("csrfmiddlewaretoken", document.querySelector('[name=csrfmiddlewaretoken]').value) // I hate this

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

            let formPlace = new FormData();
            formPlace.append("csrfmiddlewaretoken", document.querySelector('[name=csrfmiddlewaretoken]').value) // I hate this

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

    showMap = (event) => {
        event.preventDefault();
        document.querySelector('#showhideMap').style.display = 'none';

        mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

        const map = new mapboxgl.Map({
            container: 'map', //No exist yet I really dont know hot to solve this
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0], // starting position
            zoom: 1, // starting zoom
        });

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
                            delete={this.deletePlace} uuid={place.uuid} key={place.uuid}/>
                        })}
                    </div>
                </div>
                {this.state.popupSee ? this.state.popup : null}</div>);

        } else if (this.state.see === "new") {
            see = (<div>
                <h1 id="createTitle">Crear un nuevo lugar</h1>
                <form onSubmit={this.newPlaceSubmit} id='newPlace'>
                    <label htmlFor="id_name">Nombre:</label>
                    <input type="text" name="name" maxLength="20" required id="id_name" onChange={this.setValueForm}></input>
                    <label htmlFor="id_short_description">Descripción:</label>
                    <textarea name="short_description" cols="40" rows="10" maxLength="900" required id="id_short_description" onChange={this.setValueForm}></textarea>
                    <label htmlFor="id_recomedations">Recomendaciones:</label>
                    <textarea name="recomedations" cols="40" rows="10" maxLength="900" required id="id_recomedations" onChange={this.setValueForm}></textarea>

                    <label>Fotos:</label>
                    <input type="file" name="photo1" accept="image/*" id="id_photo" ref={this.fileInput[0]} required />
                    <input type="file" name="photo2" accept="image/*" id="id_photo" ref={this.fileInput[1]} required />
                    <input type="file" name="photo3" accept="image/*" id="id_photo" ref={this.fileInput[2]} required />
                    <input type="file" name="photo4" accept="image/*" id="id_photo" ref={this.fileInput[3]} required />

                    <label htmlFor="id_mayor_category">Categoria Principal:</label>
                    <select name="mayor_category" id="id_mayor_category" required onChange={(event) => {this.setValueForm(event); this.dontShowCategories(event);}}>
                        <option value="D">Donar</option>
                        <option value="V">Voluntariado</option>
                    </select>
                    <label htmlFor="id_category">Categoria:</label>
                    <select name="category" required id="id_category" onChange={(event) => {this.setValueForm(event); this.dontShowSubCategories(event);}}>
                        <option value="10">DAl (Alimentos)</option>
                        <option value="11">DBb (Artículos para Bebés)</option>
                        <option value="12">DRp (Ropa)</option>
                        <option value="13">DCn (Cocina)</option>
                        <option value="14">DCl (Colchones y Frazadas)</option>
                        <option value="15">DMu (Muebles)</option>
                        <option value="16">DTc (Tecnología)</option>
                        <option value="17">DRc (Recreación)</option>
                        <option value="18">DLb (Libros)</option>
                        <option value="19">DSl (Salud)</option>
                        <option value="20">DOt (Otros)</option>
                        <option value="21" hidden>VNi (Ayuda con Niños)</option>
                        <option value="22" hidden>VAd (Adultos Mayores)</option>
                        <option value="23" hidden>VFa (Familia)</option>
                        <option value="24" hidden>VCo (Comedores)</option>
                        <option value="25" hidden>VEd (Educación)</option>
                        <option value="26" hidden>VSl (Salud)</option>
                        <option value="27" hidden>VDs (Personas con Discapacidad)</option>
                        <option value="28" hidden>VIn (Indigencia)</option>
                        <option value="29" hidden>VRs (Reinserción Social)</option>
                        <option value="30" hidden>VPr (Profesional)</option>
                        <option value="31" hidden>VOt (Otros Voluntariados)</option>
                    </select>
                    <label htmlFor="id_sub_category">Subcategorias:</label>
                    <select name="sub_category" required id="id_sub_category" onChange={this.setValueForm}>
                        <option value="71">DAlPolv (Leche en Polvo)</option>
                        <option value="72">DAlEnte (Leche Entera)</option>
                        <option value="73">DAlNoPe (No perecederos)</option>
                        <option value="74">DAlPere (Perecederos)</option>
                        <option value="75" hidden >DBbPana (Pañales)</option>
                        <option value="76" hidden >DBbOtro (Otros (Cunas, etc))</option>
                        <option value="77" hidden >DRpNino (Para Niños)</option>
                        <option value="78" hidden >DRpJove (Para Jóvenes)</option>
                        <option value="79" hidden >DRpAdul (Para Adultos)</option>
                        <option value="80" hidden >DCnArti (Artículos de Cocina)</option>
                        <option value="81" hidden >DCnElec (Electrodomésticos)</option>
                        <option value="82" hidden >DClColc (Colchones)</option>
                        <option value="83" hidden >DClFraz (Frazadas)</option>
                        <option value="84" hidden >DClSaba (Sábanas)</option>
                        <option value="85" hidden >DMuBiAr (Bibliotecas y Armarios)</option>
                        <option value="86" hidden >DMuCaCt (Camas y Catres)</option>
                        <option value="87" hidden >DMuMeSi (Mesas y Sillas)</option>
                        <option value="88" hidden >DMuOtro (Otros Muebles)</option>
                        <option value="89" hidden >DTcCamr (Cámara de fotos/videos)</option>
                        <option value="90" hidden >DTcComp (Computadoras)</option>
                        <option value="91" hidden >DTcImpr (Impresoras)</option>
                        <option value="92" hidden >DTcOtro (Otra Tecnología)</option>
                        <option value="93" hidden >DRcDepo (Artículos Deportivos)</option>
                        <option value="94" hidden >DRcMusi (Instrumentos Musicales)</option>
                        <option value="95" hidden >DRcJugt (Juguetes)</option>
                        <option value="96" hidden >DRcArte (Material Artístico)</option>
                        <option value="97" hidden >DLbEscl (Escolares)</option>
                        <option value="98" hidden >DLbInft (Infantiles)</option>
                        <option value="99" hidden >DLbOtro (Otros Libros)</option>
                        <option value="100" hidden >DSlMedi (Medicamentos)</option>
                        <option value="101" hidden >DSlPrim (Primeros Auxilios)</option>
                        <option value="102" hidden >DSlSang (Sangre)</option>
                        <option value="103" hidden >DSlOtro (Otros Equipos Médicos)</option>
                        <option value="104" hidden >DOtLimp (Limpieza)</option>
                        <option value="105" hidden >DOtCstr (Material de Construcción)</option>
                        <option value="106" hidden >DOtPint (Pintura)</option>
                        <option value="107" hidden >DOtPelo (Cabello)</option>
                        <option value="108" hidden >DOtOtro (Otro Otro)</option>
                        <option value="109" hidden >VNiNino (Niños)</option>
                        <option value="110" hidden >VNiAdol (Adolescentes)</option>
                        <option value="111" hidden >VNiEmba (Embarazadas)</option>
                        <option value="112" hidden >VAdAdAd (Personas Mayores)</option>
                        <option value="113" hidden >VFaAsSo (Asistencia Social)</option>
                        <option value="114" hidden >VFaVivi (Vivienda)</option>
                        <option value="115" hidden >VCoNino (Con Niños)</option>
                        <option value="116" hidden >VCoAdul (Con Adultos)</option>
                        <option value="117" hidden >VEdApoy (Apoyo Escolar)</option>
                        <option value="118" hidden >VEdTall (Talleres)</option>
                        <option value="119" hidden >VEdCurs (Cursos)</option>
                        <option value="120" hidden >VSlAdic (Adicciones)</option>
                        <option value="121" hidden >VSlEnfe (Enfermedades)</option>
                        <option value="122" hidden >VSlOtro (Otro Salud)</option>
                        <option value="123" hidden >VDsNino (Niños Discapacitados)</option>
                        <option value="124" hidden >VDsAdul (Adultos Discapacitados)</option>
                        <option value="125" hidden >VInInIn (Indigencia)</option>
                        <option value="126" hidden >VRsCarc (Cárceles)</option>
                        <option value="127" hidden >VRsOtro (Otros Centros)</option>
                        <option value="128" hidden >VPrAdmi (Administración)</option>
                        <option value="129" hidden >VPrComu (Comunicación)</option>
                        <option value="130" hidden >VPrDere (Derecho)</option>
                        <option value="131" hidden >VPrDise (Diseño)</option>
                        <option value="132" hidden >VPrDoce (Docencia)</option>
                        <option value="133" hidden >VPrMedi (Médicos)</option>
                        <option value="134" hidden >VPrPsic (Psicología)</option>
                        <option value="135" hidden >VPrTecn (Tecnología)</option>
                        <option value="136" hidden >VPrCoci (Cocinero)</option>
                        <option value="137" hidden >VOtAnim (Animales)</option>
                        <option value="138" hidden >VOtAmbi (Medio Ambiente)</option>
                        <option value="139" hidden >VOtOtro (Otros Voluntariados)</option>
                        <option value="141" hidden >DOtDine (Dinero)</option>
                        <option value="142" hidden >DAlAgua (Agua)</option>
                    </select>

                    <h2>Donde esta ubicado?</h2>
                    <h4>Haz click en donde esta ubicado</h4>
                    <button onClick={this.showMap} id="showhideMap">Mostrar el Mapa</button>
                    <div id="map"></div>

                    <input type="submit"></input>
                    <h6>{this.state.formError}</h6>
                </form>
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