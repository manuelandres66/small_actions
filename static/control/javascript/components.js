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
                    <i className="fas fa-barcode" onClick={() => props.forCode(props.name, props.uuid)} />
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

const PopupCode = (props) => {
    return (
        <div id="popupCode">
            <h5>Codigo de {props.name}</h5>
            <h1>{props.code}</h1>
            <div>
                <i className="fas fa-info-circle"></i>
                Cambia 2 segundos despues de ser ingresado   
            </div>
            <div id="notifications">
                {props.notifications.map(notify => {
                    return (
                        <div key={notify.id} className="notify">
                            <div>
                                <img src={notify.photo} alt="userPhoto" />
                                <h5>{notify.username}</h5>
                            </div>
                            <div>
                                <i className="fas fa-check-circle" onClick={() => props.discard(notify.id, true)}></i>
                                <i className="fas fa-times-circle" onClick={() => props.discard(notify.id, false)}></i>
                                <i className="fas fa-ban" onClick={() => props.ban(notify.id)}></i>
                            </div>
                        </div>
                    )
                })}
            </div>
            <button onClick={props.see} >Okey</button>
        </div>
    )
}

const FormPlaces = (props) => {
    return (
        <div>
            <form onSubmit={props.submit} id='newPlace'>
                <label htmlFor="id_name">Nombre:</label>
                <input type="text" name="name" maxLength="20" required id="id_name" onChange={props.setValue}></input>
                <label htmlFor="id_short_description">Descripción:</label>
                <textarea name="short_description" maxLength="900" required id="id_short_description" onChange={props.setValue}></textarea>
                <label htmlFor="id_recomedations">Recomendaciones:</label>
                <textarea name="recomedations" maxLength="900" required id="id_recomedations" onChange={props.setValue}></textarea>

                <label>Fotos:</label>
                <div id="photos">
                    <input type="file" name="photo1" accept="image/*" id="id_photo" required/>
                    <input type="file" name="photo2" accept="image/*" id="id_photo" />
                    <input type="file" name="photo3" accept="image/*" id="id_photo" />
                    <input type="file" name="photo4" accept="image/*" id="id_photo" />
                </div>

                <div id="selectCategory">
                    <div>
                        <label htmlFor="id_mayor_category">Categoria Principal:</label>
                        <select name="mayor_category" id="id_mayor_category" required onChange={(event) => {props.setValue(event); props.dontShowCate(event);}}>
                            <option value="D">Donar</option>
                            <option value="V">Voluntariado</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="id_category">Categoria:</label>
                        <select name="category" required id="id_category" onChange={(event) => {props.setValue(event); props.dontShowSub(event);}}>
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
                    </div>
                </div>

                <label htmlFor="id_sub_category">Subcategorias:</label>
                <select name="sub_category" required id="id_sub_category" onChange={props.setValue}>
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
                <div id="map"></div>

                <input type="submit" value="Enviar"></input>
                <h6>{props.error}</h6>
            </form>
        </div>
    )
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}