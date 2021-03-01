
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
            'see' : 'places'
        };
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

    render() {
        let see = null;
        if (this.state.see === "places") {
            see = (<div>
                <div id="add" onClick={() => this.setSeeTo('new')}>Añadir Nuevo <i class="fas fa-plus"></i></div>
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
                <h1>Crear un nuevo lugar</h1>
                <form>
                    <label for="id_name">Nombre:</label>
                    <input type="text" name="name" maxlength="20" required="" id="id_name"></input>
                    <label for="id_short_description">Descripción:</label>
                    <textarea name="short_description" cols="40" rows="10" maxlength="900" required="" id="id_short_description"></textarea>
                    <label for="id_recomedations">Recomendaciones:</label>
                    <textarea name="recomedations" cols="40" rows="10" maxlength="900" required="" id="id_recomedations"></textarea>
                    <label>Fotos:</label>
                    <input type="file" name="photo1" accept="image/*" id="id_photo"></input>
                    <input type="file" name="photo2" accept="image/*" id="id_photo"></input>
                    <input type="file" name="photo3" accept="image/*" id="id_photo"></input>
                    <input type="file" name="photo4" accept="image/*" id="id_photo"></input>
                    <label for="id_mayor_category">Categoria Principal:</label>
                    <select name="mayor_category" id="id_mayor_category">
                        <option value="D" selected="">Donar</option>
                        <option value="V">Voluntariado</option>
                    </select>
                    <label for="id_category">Categoria:</label>
                    <select name="category" required="" id="id_category">
                        <option value="" selected="">---------</option>
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
                        <option value="21">VNi (Ayuda con Niños)</option>
                        <option value="22">VAd (Adultos Mayores)</option>
                        <option value="23">VFa (Familia)</option>
                        <option value="24">VCo (Comedores)</option>
                        <option value="25">VEd (Educación)</option>
                        <option value="26">VSl (Salud)</option>
                        <option value="27">VDs (Personas con Discapacidad)</option>
                        <option value="28">VIn (Indigencia)</option>
                        <option value="29">VRs (Reinserción Social)</option>
                        <option value="30">VPr (Profesional)</option>
                        <option value="31">VOt (Otros Voluntariados)</option>
                    </select>
                    <label for="id_sub_category">Subcategorias:</label>
                    <select name="sub_category" required="" id="id_sub_category" multiple>
                        <option value="71">DAlPolv (Leche en Polvo)</option>
                        <option value="72">DAlEnte (Leche Entera)</option>
                        <option value="73">DAlNoPe (No perecederos)</option>
                        <option value="74">DAlPere (Perecederos)</option>
                        <option value="75">DBbPana (Pañales)</option>
                        <option value="76">DBbOtro (Otros (Cunas, etc))</option>
                        <option value="77">DRpNino (Para Niños)</option>
                        <option value="78">DRpJove (Para Jóvenes)</option>
                        <option value="79">DRpAdul (Para Adultos)</option>
                        <option value="80">DCnArti (Artículos de Cocina)</option>
                        <option value="81">DCnElec (Electrodomésticos)</option>
                        <option value="82">DClColc (Colchones)</option>
                        <option value="83">DClFraz (Frazadas)</option>
                        <option value="84">DClSaba (Sábanas)</option>
                        <option value="85">DMuBiAr (Bibliotecas y Armarios)</option>
                        <option value="86">DMuCaCt (Camas y Catres)</option>
                        <option value="87">DMuMeSi (Mesas y Sillas)</option>
                        <option value="88">DMuOtro (Otros Muebles)</option>
                        <option value="89">DTcCamr (Cámara de fotos/videos)</option>
                        <option value="90">DTcComp (Computadoras)</option>
                        <option value="91">DTcImpr (Impresoras)</option>
                        <option value="92">DTcOtro (Otra Tecnología)</option>
                        <option value="93">DRcDepo (Artículos Deportivos)</option>
                        <option value="94">DRcMusi (Instrumentos Musicales)</option>
                        <option value="95">DRcJugt (Juguetes)</option>
                        <option value="96">DRcArte (Material Artístico)</option>
                        <option value="97">DLbEscl (Escolares)</option>
                        <option value="98">DLbInft (Infantiles)</option>
                        <option value="99">DLbOtro (Otros Libros)</option>
                        <option value="100">DSlMedi (Medicamentos)</option>
                        <option value="101">DSlPrim (Primeros Auxilios)</option>
                        <option value="102">DSlSang (Sangre)</option>
                        <option value="103">DSlOtro (Otros Equipos Médicos)</option>
                        <option value="104">DOtLimp (Limpieza)</option>
                        <option value="105">DOtCstr (Material de Construcción)</option>
                        <option value="106">DOtPint (Pintura)</option>
                        <option value="107">DOtPelo (Cabello)</option>
                        <option value="108">DOtOtro (Otro Otro)</option>
                        <option value="109">VNiNino (Niños)</option>
                        <option value="110">VNiAdol (Adolescentes)</option>
                        <option value="111">VNiEmba (Embarazadas)</option>
                        <option value="112">VAdAdAd (Personas Mayores)</option>
                        <option value="113">VFaAsSo (Asistencia Social)</option>
                        <option value="114">VFaVivi (Vivienda)</option>
                        <option value="115">VCoNino (Con Niños)</option>
                        <option value="116">VCoAdul (Con Adultos)</option>
                        <option value="117">VEdApoy (Apoyo Escolar)</option>
                        <option value="118">VEdTall (Talleres)</option>
                        <option value="119">VEdCurs (Cursos)</option>
                        <option value="120">VSlAdic (Adicciones)</option>
                        <option value="121">VSlEnfe (Enfermedades)</option>
                        <option value="122">VSlOtro (Otro Salud)</option>
                        <option value="123">VDsNino (Niños Discapacitados)</option>
                        <option value="124">VDsAdul (Adultos Discapacitados)</option>
                        <option value="125">VInInIn (Indigencia)</option>
                        <option value="126">VRsCarc (Cárceles)</option>
                        <option value="127">VRsOtro (Otros Centros)</option>
                        <option value="128">VPrAdmi (Administración)</option>
                        <option value="129">VPrComu (Comunicación)</option>
                        <option value="130">VPrDere (Derecho)</option>
                        <option value="131">VPrDise (Diseño)</option>
                        <option value="132">VPrDoce (Docencia)</option>
                        <option value="133">VPrMedi (Médicos)</option>
                        <option value="134">VPrPsic (Psicología)</option>
                        <option value="135">VPrTecn (Tecnología)</option>
                        <option value="136">VPrCoci (Cocinero)</option>
                        <option value="137">VOtAnim (Animales)</option>
                        <option value="138">VOtAmbi (Medio Ambiente)</option>
                        <option value="139">VOtOtro (Otros Voluntariados)</option>
                        <option value="141">DOtDine (Dinero)</option>
                        <option value="142">DAlAgua (Agua)</option>
                    </select>
                    <input type="submit"></input>
                </form>
            </div>)
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