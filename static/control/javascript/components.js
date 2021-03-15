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
                    <i className="fas fa-edit" onClick={() => props.toEdit(props.uuid)}/>
                    <i className="fas fa-chart-line" onClick={() => props.showInfo(props.name, props.uuid)}></i>
                    <i className="fas fa-barcode" onClick={() => props.forCode(props.name, props.uuid)} />
                    <i className="fas fa-trash" onClick={() => props.delete(props.name, props.uuid)}/>
                </div> : null }
            </div>
        </div>
    )
};

const PopupDelete = (props) => {
    return (
        <div id="popupDelete" className="popUp">
            <h3>¿Estas seguro que quieres eliminar {props.name}?</h3>
            <button id="buttonYes" onClick={() => props.delete(props.uuid)}>Si</button>
            <button id="buttonNo" onClick={props.see}>No</button>
        </div>
    )
};

const PopUpInfo = (props) => {
    return (
        <div className="popUp" id="popInfo">
            <i className="far fa-times-circle" id="closePop" onClick={props.see}></i>
            <h1>Info de {props.name}</h1>
            <div className="infoInfo" id='principalInfo'>
                <div>
                    <h3>{props.data.views}</h3>
                    <h6><i className="far fa-eye"></i> Vistas</h6>
                </div>
                <div>
                    <h3>{props.data.visited}</h3>
                    <h6><i className="fas fa-map-marker-alt"></i> Visitas</h6>
                </div>
            </div>
            <div className="infoInfo" id='secondInfo'>
                <div>
                    <h5>{props.data.comments}</h5>
                    <h6><i className="far fa-comment"></i> Comentarios</h6>
                </div>
                <div>
                    <h5>{props.data.pointsGenerated}</h5>
                    <h6><i class="far fa-arrow-alt-circle-up"></i> Puntos Generados</h6>
                </div>
                <div>
                    <h5>{props.data.notifications}</h5>
                    <h6><i class="fas fa-exclamation-circle"></i> Notificaciones</h6>
                </div>
            </div>
        </div>
    )
}

const PopupCode = (props) => {
    return (
        <div id="popupCode" className="popUp">
            <i className="far fa-times-circle" id="closePop" onClick={props.see}></i>
            <h5>Codigo de {props.name}</h5>
            <h1>{props.code}</h1>
            <div id="popUpInfo">
                <i className="fas fa-info-circle"></i>
                Cambia 2 segundos despues de ser ingresado   
            </div>
            <div id="notifications">
                {props.notifications.map(notify => {
                    return (
                        <div key={notify.id} className="notify">
                            <img src={notify.photo} alt="userPhoto" />
                            <h5>{notify.username}</h5>
                            <i className="fas fa-check-circle" id='aproved' onClick={() => props.discard(notify.id, true)}></i>
                            <i className="fas fa-times-circle" id="rejected" onClick={() => props.discard(notify.id, false)}></i>
                            <i className="fas fa-ban" onClick={() => props.ban(notify.id)}></i>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const FormPlaces = (props) => {
    return (
        <div>
            <form onSubmit={(event) => props.submit(event, props.photos, props.edit)} id='newPlace'>
                <label htmlFor="id_name">Nombre:</label>
                <input type="text" name="name" maxLength="20" required id="id_name" onChange={props.setValue} value={props.default.name}></input>
                <label htmlFor="id_short_description">Descripción:</label>
                <textarea name="short_description" maxLength="900" required id="id_short_description" onChange={props.setValue} value={props.default.short_description}></textarea>
                <label htmlFor="id_recomedations">Recomendaciones:</label>
                <textarea name="recomedations" maxLength="900" required id="id_recomedations" onChange={props.setValue} value={props.default.recomedations}></textarea>

                <label>Fotos:</label>
                <div id="photos">
                    <a href={'/control/photo?id=' + props.photos[0]} target="_blank">{props.photos[0]}</a>
                    <input type="file" name="photo1" accept="image/*" id="id_photo" />
                    <a href={'/control/photo?id=' + props.photos[1]} target="_blank">{props.photos[1]}</a>
                    <input type="file" name="photo2" accept="image/*" id="id_photo" />
                    <a href={'/control/photo?id=' + props.photos[2]} target="_blank">{props.photos[2]}</a>
                    <input type="file" name="photo3" accept="image/*" id="id_photo" />
                    <a href={'/control/photo?id=' + props.photos[3]} target="_blank">{props.photos[3]}</a>
                    <input type="file" name="photo4" accept="image/*" id="id_photo" />
                </div>

                <div id="selectCategory">
                    <div>
                        <label htmlFor="id_mayor_category">Categoria Principal:</label>
                        <select name="mayor_category" id="id_mayor_category" required defaultValue={props.default.mayor_category} onChange={(event) => {props.setValue(event); props.dontShowCate(event);}}>
                            <option value="D">Donar</option>
                            <option value="V">Voluntariado</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="id_category">Categoria:</label>
                        <select name="category" required id="id_category" defaultValue={props.default.category} onChange={(event) => {props.setValue(event); props.dontShowSub(event);}}>
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
                <select name="sub_category" required id="id_sub_category" defaultValue={props.default.sub_category} onChange={props.setValue}>
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

//I really only do this fuction to not get long jsx-html code in the index.js
const HelpView = (props) => {
    return (
        <div>
            <div className="helpInfo">
                <i className="fas fa-question"></i>
                <div>
                    <h4>Funcionamiento de la página</h4>
                    <p>
                        Al entrar te aparecerán todos los lugares que has registrado (si has registrado alguno) con su foto y su nombre, 
                        para realizar acciones sobre un lugar tienes que darle click, y después elegir una de las opciones que se explicarán más adelante.
                        También se te proporciona una barra de búsqueda por nombre, y un botón de agregar nuevo.
                    </p>
                </div>
            </div>
            <div className="helpInfo">
                <div>
                    <h4>Agregar Nuevo</h4>
                    <p>
                        Al darle click al botón en la página principal de dar más, se abrirá un formulario con toda la información requerida para agregar 
                        el nuevo sitio. No es necesario agregar todas las fotos, pero si por lo menos una. Para agregar la ubicación da click en el mapa en 
                        donde se encuentre el sitio, esto creará un marcador. La barra de busqueda del mapa solo te llevara a un lugar, pero no significa que 
                        ese lugar esté marcado.
                    </p>
                </div>
                <i className="fas fa-plus"></i>
            </div>
            <div className="helpInfo">
                <i className="fas fa-eye"></i>
                <div>
                    <h4>Ver sitio</h4>
                    <p>
                        Al elegir esta opcion despues de darle click a un lugar, se abrirá la vista que tiene el usuario del sitio. Sin embargo, 
                        <strong> recuerde que los cambios que realice puede no observarse hasta 15 minutos después</strong>.
                    </p>
                </div>
            </div>
            <div className="helpInfo">
                <div>
                    <h4>Editar sitio</h4>
                    <p>
                        En la opción editar, se cambia la vista a un formulario ya completado con la información pertinente, es igual que agregar uno nuevo
                        pero la diferencia radica en las fotos. A la derecha de cada campo de fotos puede o no aparecer un número. Si es así, significa que 
                        ya tiene una foto en ese campo y que si cambia ese campo la anterior foto va a desaparecer. Puede ver la foto que tiene dándole click
                        a ese número. Si no existe dicho número, significa que no se ha agregado una foto en ese campo, y que al hacerlo no eliminará ninguna
                        otra. 
                    </p>
                </div>
                <i className="fas fa-edit"></i>
            </div>
            <div className="helpInfo">
                <i className="fas fa-chart-line"></i>
                <div>
                    <h4>Estadísticas</h4>
                    <p>
                        Esta opción salta un pop-up el cual te da cierto datos sobre el lugar. Explicaremos cada uno a continuación. Las vistas, representan el
                        número de veces que se ha abierto la página de información del sitio (la misma que aparece cuando le das a ver sitio). Las visitas representan
                        el número de veces que personas han visitado tu sitio fisicamente, han ingresado el código y han sido aprobadas. Los comentarios, representan
                        la cantidad de comentarios que hay en la pagina de informacion. Los puntos generados, representa la cantidad de puntos que suman en total todos
                        los puntos ganados en cada visita. Y las notificaciones son el número de notificaciones que se han generado, tanto aprobadas como no aprobas, 
                        incluso baneadas.
                    </p>
                </div>
            </div>
            <div className="helpInfo">
                <div>
                    <h4>Código</h4>
                    <p>
                        Esta opción da un pop-up que te muestra el código que le debes dar a quienes visiten tu sitio, de esta manera ellos ganan puntos y registran su actividad.
                        Cuando un usuario ingrese correctamente el codigo, te aparecera una notificacion con su nombre y su foto de perfil. Usted tiene tres opciones. Aprobarlo,
                        lo cual le dará los puntos sin ningún problema. Denegarlo, lo cual le restara los puntos ganados (este cambio se puede ver 15 min después). O banearlo, lo
                        cual además de restarle los puntos le inhabilita la cuenta. <strong>Tenga en cuenta que usted solo puede negar o banear con un motivo claro de visita inadecuada. </strong>
                        Podemos restringir su cuenta si no cumple con esto.
                    </p>
                </div>
                <i className="fas fa-chart-line"></i>
            </div>
            <div className="helpInfo">
                <i className="fas fa-trash"></i>
                <div>
                    <h4>Eliminar sitio</h4>
                    <p>
                        Al darle click, le aparecerá un pop-up para confirmar su acción. Si usted dice que no simplemente se cierra el popup. Si usted dice que si toda la información 
                        relacionada con el lugar será eliminada de nuestras bases de datos. 
                    </p>
                </div>
            </div>
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