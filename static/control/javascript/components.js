const Place = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "place"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => props.to_hover(props.uuid)
  }, /*#__PURE__*/React.createElement("img", {
    src: props.image
  }), /*#__PURE__*/React.createElement("h5", null, props.name)), /*#__PURE__*/React.createElement("div", {
    className: "conf"
  }, props.hover ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye",
    onClick: () => window.open(props.url, '_blank')
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit",
    onClick: () => props.toEdit(props.uuid)
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-line",
    onClick: () => props.showInfo(props.name, props.uuid)
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-barcode",
    onClick: () => props.forCode(props.name, props.uuid)
  }), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash",
    onClick: () => props.delete(props.name, props.uuid)
  })) : null));
};

const PopupDelete = props => {
  return /*#__PURE__*/React.createElement("div", {
    id: "popupDelete",
    className: "popUp"
  }, /*#__PURE__*/React.createElement("h3", null, "\xBFEstas seguro que quieres eliminar ", props.name, "?"), /*#__PURE__*/React.createElement("button", {
    id: "buttonYes",
    onClick: () => props.delete(props.uuid)
  }, "Si"), /*#__PURE__*/React.createElement("button", {
    id: "buttonNo",
    onClick: props.see
  }, "No"));
};

const PopUpInfo = props => {
  return /*#__PURE__*/React.createElement("div", {
    className: "popUp",
    id: "popInfo"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-times-circle",
    id: "closePop",
    onClick: props.see
  }), /*#__PURE__*/React.createElement("h1", null, "Info de ", props.name), /*#__PURE__*/React.createElement("div", {
    className: "infoInfo",
    id: "principalInfo"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, props.data.views), /*#__PURE__*/React.createElement("h6", null, /*#__PURE__*/React.createElement("i", {
    className: "far fa-eye"
  }), " Vistas")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, props.data.visited), /*#__PURE__*/React.createElement("h6", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-map-marker-alt"
  }), " Visitas"))), /*#__PURE__*/React.createElement("div", {
    className: "infoInfo",
    id: "secondInfo"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, props.data.comments), /*#__PURE__*/React.createElement("h6", null, /*#__PURE__*/React.createElement("i", {
    className: "far fa-comment"
  }), " Comentarios")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, props.data.pointsGenerated), /*#__PURE__*/React.createElement("h6", null, /*#__PURE__*/React.createElement("i", {
    class: "far fa-arrow-alt-circle-up"
  }), " Puntos Generados")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, props.data.notifications), /*#__PURE__*/React.createElement("h6", null, /*#__PURE__*/React.createElement("i", {
    class: "fas fa-exclamation-circle"
  }), " Notificaciones"))));
};

const PopupCode = props => {
  return /*#__PURE__*/React.createElement("div", {
    id: "popupCode",
    className: "popUp"
  }, /*#__PURE__*/React.createElement("i", {
    className: "far fa-times-circle",
    id: "closePop",
    onClick: props.see
  }), /*#__PURE__*/React.createElement("h5", null, "Codigo de ", props.name), /*#__PURE__*/React.createElement("h1", null, props.code), /*#__PURE__*/React.createElement("div", {
    id: "popUpInfo"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-info-circle"
  }), "Cambia 2 segundos despues de ser ingresado"), /*#__PURE__*/React.createElement("div", {
    id: "notifications"
  }, props.notifications.map(notify => {
    return /*#__PURE__*/React.createElement("div", {
      key: notify.id,
      className: "notify"
    }, /*#__PURE__*/React.createElement("img", {
      src: notify.photo,
      alt: "userPhoto"
    }), /*#__PURE__*/React.createElement("h5", null, notify.username), /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check-circle",
      id: "aproved",
      onClick: () => props.discard(notify.id, true)
    }), /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times-circle",
      id: "rejected",
      onClick: () => props.discard(notify.id, false)
    }), /*#__PURE__*/React.createElement("i", {
      className: "fas fa-ban",
      onClick: () => props.ban(notify.id)
    }));
  })));
};

const FormPlaces = props => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    onSubmit: event => props.submit(event, props.photos, props.edit),
    id: "newPlace"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_name"
  }, "Nombre:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "name",
    maxLength: "20",
    required: true,
    id: "id_name",
    onChange: props.setValue,
    value: props.default.name
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_short_description"
  }, "Descripci\xF3n:"), /*#__PURE__*/React.createElement("textarea", {
    name: "short_description",
    maxLength: "900",
    required: true,
    id: "id_short_description",
    onChange: props.setValue,
    value: props.default.short_description
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_recomedations"
  }, "Recomendaciones:"), /*#__PURE__*/React.createElement("textarea", {
    name: "recomedations",
    maxLength: "900",
    required: true,
    id: "id_recomedations",
    onChange: props.setValue,
    value: props.default.recomedations
  }), /*#__PURE__*/React.createElement("label", null, "Fotos:"), /*#__PURE__*/React.createElement("div", {
    id: "photos"
  }, /*#__PURE__*/React.createElement("a", {
    href: '/control/photo?id=' + props.photos[0],
    target: "_blank"
  }, props.photos[0]), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "photo1",
    accept: "image/*",
    id: "id_photo"
  }), /*#__PURE__*/React.createElement("a", {
    href: '/control/photo?id=' + props.photos[1],
    target: "_blank"
  }, props.photos[1]), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "photo2",
    accept: "image/*",
    id: "id_photo"
  }), /*#__PURE__*/React.createElement("a", {
    href: '/control/photo?id=' + props.photos[2],
    target: "_blank"
  }, props.photos[2]), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "photo3",
    accept: "image/*",
    id: "id_photo"
  }), /*#__PURE__*/React.createElement("a", {
    href: '/control/photo?id=' + props.photos[3],
    target: "_blank"
  }, props.photos[3]), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "photo4",
    accept: "image/*",
    id: "id_photo"
  })), /*#__PURE__*/React.createElement("div", {
    id: "selectCategory"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_mayor_category"
  }, "Categoria Principal:"), /*#__PURE__*/React.createElement("select", {
    name: "mayor_category",
    id: "id_mayor_category",
    required: true,
    defaultValue: props.default.mayor_category,
    onChange: event => {
      props.setValue(event);
      props.dontShowCate(event);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "D"
  }, "Donar"), /*#__PURE__*/React.createElement("option", {
    value: "V"
  }, "Voluntariado"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_category"
  }, "Categoria:"), /*#__PURE__*/React.createElement("select", {
    name: "category",
    required: true,
    id: "id_category",
    defaultValue: props.default.category,
    onChange: event => {
      props.setValue(event);
      props.dontShowSub(event);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "10"
  }, "DAl (Alimentos)"), /*#__PURE__*/React.createElement("option", {
    value: "11"
  }, "DBb (Art\xEDculos para Beb\xE9s)"), /*#__PURE__*/React.createElement("option", {
    value: "12"
  }, "DRp (Ropa)"), /*#__PURE__*/React.createElement("option", {
    value: "13"
  }, "DCn (Cocina)"), /*#__PURE__*/React.createElement("option", {
    value: "14"
  }, "DCl (Colchones y Frazadas)"), /*#__PURE__*/React.createElement("option", {
    value: "15"
  }, "DMu (Muebles)"), /*#__PURE__*/React.createElement("option", {
    value: "16"
  }, "DTc (Tecnolog\xEDa)"), /*#__PURE__*/React.createElement("option", {
    value: "17"
  }, "DRc (Recreaci\xF3n)"), /*#__PURE__*/React.createElement("option", {
    value: "18"
  }, "DLb (Libros)"), /*#__PURE__*/React.createElement("option", {
    value: "19"
  }, "DSl (Salud)"), /*#__PURE__*/React.createElement("option", {
    value: "20"
  }, "DOt (Otros)"), /*#__PURE__*/React.createElement("option", {
    value: "21",
    hidden: true
  }, "VNi (Ayuda con Ni\xF1os)"), /*#__PURE__*/React.createElement("option", {
    value: "22",
    hidden: true
  }, "VAd (Adultos Mayores)"), /*#__PURE__*/React.createElement("option", {
    value: "23",
    hidden: true
  }, "VFa (Familia)"), /*#__PURE__*/React.createElement("option", {
    value: "24",
    hidden: true
  }, "VCo (Comedores)"), /*#__PURE__*/React.createElement("option", {
    value: "25",
    hidden: true
  }, "VEd (Educaci\xF3n)"), /*#__PURE__*/React.createElement("option", {
    value: "26",
    hidden: true
  }, "VSl (Salud)"), /*#__PURE__*/React.createElement("option", {
    value: "27",
    hidden: true
  }, "VDs (Personas con Discapacidad)"), /*#__PURE__*/React.createElement("option", {
    value: "28",
    hidden: true
  }, "VIn (Indigencia)"), /*#__PURE__*/React.createElement("option", {
    value: "29",
    hidden: true
  }, "VRs (Reinserci\xF3n Social)"), /*#__PURE__*/React.createElement("option", {
    value: "30",
    hidden: true
  }, "VPr (Profesional)"), /*#__PURE__*/React.createElement("option", {
    value: "31",
    hidden: true
  }, "VOt (Otros Voluntariados)")))), /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_sub_category"
  }, "Subcategorias:"), /*#__PURE__*/React.createElement("select", {
    name: "sub_category",
    required: true,
    id: "id_sub_category",
    defaultValue: props.default.sub_category,
    onChange: props.setValue
  }, /*#__PURE__*/React.createElement("option", {
    value: "71"
  }, "DAlPolv (Leche en Polvo)"), /*#__PURE__*/React.createElement("option", {
    value: "72"
  }, "DAlEnte (Leche Entera)"), /*#__PURE__*/React.createElement("option", {
    value: "73"
  }, "DAlNoPe (No perecederos)"), /*#__PURE__*/React.createElement("option", {
    value: "74"
  }, "DAlPere (Perecederos)"), /*#__PURE__*/React.createElement("option", {
    value: "75",
    hidden: true
  }, "DBbPana (Pa\xF1ales)"), /*#__PURE__*/React.createElement("option", {
    value: "76",
    hidden: true
  }, "DBbOtro (Otros (Cunas, etc))"), /*#__PURE__*/React.createElement("option", {
    value: "77",
    hidden: true
  }, "DRpNino (Para Ni\xF1os)"), /*#__PURE__*/React.createElement("option", {
    value: "78",
    hidden: true
  }, "DRpJove (Para J\xF3venes)"), /*#__PURE__*/React.createElement("option", {
    value: "79",
    hidden: true
  }, "DRpAdul (Para Adultos)"), /*#__PURE__*/React.createElement("option", {
    value: "80",
    hidden: true
  }, "DCnArti (Art\xEDculos de Cocina)"), /*#__PURE__*/React.createElement("option", {
    value: "81",
    hidden: true
  }, "DCnElec (Electrodom\xE9sticos)"), /*#__PURE__*/React.createElement("option", {
    value: "82",
    hidden: true
  }, "DClColc (Colchones)"), /*#__PURE__*/React.createElement("option", {
    value: "83",
    hidden: true
  }, "DClFraz (Frazadas)"), /*#__PURE__*/React.createElement("option", {
    value: "84",
    hidden: true
  }, "DClSaba (S\xE1banas)"), /*#__PURE__*/React.createElement("option", {
    value: "85",
    hidden: true
  }, "DMuBiAr (Bibliotecas y Armarios)"), /*#__PURE__*/React.createElement("option", {
    value: "86",
    hidden: true
  }, "DMuCaCt (Camas y Catres)"), /*#__PURE__*/React.createElement("option", {
    value: "87",
    hidden: true
  }, "DMuMeSi (Mesas y Sillas)"), /*#__PURE__*/React.createElement("option", {
    value: "88",
    hidden: true
  }, "DMuOtro (Otros Muebles)"), /*#__PURE__*/React.createElement("option", {
    value: "89",
    hidden: true
  }, "DTcCamr (C\xE1mara de fotos/videos)"), /*#__PURE__*/React.createElement("option", {
    value: "90",
    hidden: true
  }, "DTcComp (Computadoras)"), /*#__PURE__*/React.createElement("option", {
    value: "91",
    hidden: true
  }, "DTcImpr (Impresoras)"), /*#__PURE__*/React.createElement("option", {
    value: "92",
    hidden: true
  }, "DTcOtro (Otra Tecnolog\xEDa)"), /*#__PURE__*/React.createElement("option", {
    value: "93",
    hidden: true
  }, "DRcDepo (Art\xEDculos Deportivos)"), /*#__PURE__*/React.createElement("option", {
    value: "94",
    hidden: true
  }, "DRcMusi (Instrumentos Musicales)"), /*#__PURE__*/React.createElement("option", {
    value: "95",
    hidden: true
  }, "DRcJugt (Juguetes)"), /*#__PURE__*/React.createElement("option", {
    value: "96",
    hidden: true
  }, "DRcArte (Material Art\xEDstico)"), /*#__PURE__*/React.createElement("option", {
    value: "97",
    hidden: true
  }, "DLbEscl (Escolares)"), /*#__PURE__*/React.createElement("option", {
    value: "98",
    hidden: true
  }, "DLbInft (Infantiles)"), /*#__PURE__*/React.createElement("option", {
    value: "99",
    hidden: true
  }, "DLbOtro (Otros Libros)"), /*#__PURE__*/React.createElement("option", {
    value: "100",
    hidden: true
  }, "DSlMedi (Medicamentos)"), /*#__PURE__*/React.createElement("option", {
    value: "101",
    hidden: true
  }, "DSlPrim (Primeros Auxilios)"), /*#__PURE__*/React.createElement("option", {
    value: "102",
    hidden: true
  }, "DSlSang (Sangre)"), /*#__PURE__*/React.createElement("option", {
    value: "103",
    hidden: true
  }, "DSlOtro (Otros Equipos M\xE9dicos)"), /*#__PURE__*/React.createElement("option", {
    value: "104",
    hidden: true
  }, "DOtLimp (Limpieza)"), /*#__PURE__*/React.createElement("option", {
    value: "105",
    hidden: true
  }, "DOtCstr (Material de Construcci\xF3n)"), /*#__PURE__*/React.createElement("option", {
    value: "106",
    hidden: true
  }, "DOtPint (Pintura)"), /*#__PURE__*/React.createElement("option", {
    value: "107",
    hidden: true
  }, "DOtPelo (Cabello)"), /*#__PURE__*/React.createElement("option", {
    value: "108",
    hidden: true
  }, "DOtOtro (Otro Otro)"), /*#__PURE__*/React.createElement("option", {
    value: "109",
    hidden: true
  }, "VNiNino (Ni\xF1os)"), /*#__PURE__*/React.createElement("option", {
    value: "110",
    hidden: true
  }, "VNiAdol (Adolescentes)"), /*#__PURE__*/React.createElement("option", {
    value: "111",
    hidden: true
  }, "VNiEmba (Embarazadas)"), /*#__PURE__*/React.createElement("option", {
    value: "112",
    hidden: true
  }, "VAdAdAd (Personas Mayores)"), /*#__PURE__*/React.createElement("option", {
    value: "113",
    hidden: true
  }, "VFaAsSo (Asistencia Social)"), /*#__PURE__*/React.createElement("option", {
    value: "114",
    hidden: true
  }, "VFaVivi (Vivienda)"), /*#__PURE__*/React.createElement("option", {
    value: "115",
    hidden: true
  }, "VCoNino (Con Ni\xF1os)"), /*#__PURE__*/React.createElement("option", {
    value: "116",
    hidden: true
  }, "VCoAdul (Con Adultos)"), /*#__PURE__*/React.createElement("option", {
    value: "117",
    hidden: true
  }, "VEdApoy (Apoyo Escolar)"), /*#__PURE__*/React.createElement("option", {
    value: "118",
    hidden: true
  }, "VEdTall (Talleres)"), /*#__PURE__*/React.createElement("option", {
    value: "119",
    hidden: true
  }, "VEdCurs (Cursos)"), /*#__PURE__*/React.createElement("option", {
    value: "120",
    hidden: true
  }, "VSlAdic (Adicciones)"), /*#__PURE__*/React.createElement("option", {
    value: "121",
    hidden: true
  }, "VSlEnfe (Enfermedades)"), /*#__PURE__*/React.createElement("option", {
    value: "122",
    hidden: true
  }, "VSlOtro (Otro Salud)"), /*#__PURE__*/React.createElement("option", {
    value: "123",
    hidden: true
  }, "VDsNino (Ni\xF1os Discapacitados)"), /*#__PURE__*/React.createElement("option", {
    value: "124",
    hidden: true
  }, "VDsAdul (Adultos Discapacitados)"), /*#__PURE__*/React.createElement("option", {
    value: "125",
    hidden: true
  }, "VInInIn (Indigencia)"), /*#__PURE__*/React.createElement("option", {
    value: "126",
    hidden: true
  }, "VRsCarc (C\xE1rceles)"), /*#__PURE__*/React.createElement("option", {
    value: "127",
    hidden: true
  }, "VRsOtro (Otros Centros)"), /*#__PURE__*/React.createElement("option", {
    value: "128",
    hidden: true
  }, "VPrAdmi (Administraci\xF3n)"), /*#__PURE__*/React.createElement("option", {
    value: "129",
    hidden: true
  }, "VPrComu (Comunicaci\xF3n)"), /*#__PURE__*/React.createElement("option", {
    value: "130",
    hidden: true
  }, "VPrDere (Derecho)"), /*#__PURE__*/React.createElement("option", {
    value: "131",
    hidden: true
  }, "VPrDise (Dise\xF1o)"), /*#__PURE__*/React.createElement("option", {
    value: "132",
    hidden: true
  }, "VPrDoce (Docencia)"), /*#__PURE__*/React.createElement("option", {
    value: "133",
    hidden: true
  }, "VPrMedi (M\xE9dicos)"), /*#__PURE__*/React.createElement("option", {
    value: "134",
    hidden: true
  }, "VPrPsic (Psicolog\xEDa)"), /*#__PURE__*/React.createElement("option", {
    value: "135",
    hidden: true
  }, "VPrTecn (Tecnolog\xEDa)"), /*#__PURE__*/React.createElement("option", {
    value: "136",
    hidden: true
  }, "VPrCoci (Cocinero)"), /*#__PURE__*/React.createElement("option", {
    value: "137",
    hidden: true
  }, "VOtAnim (Animales)"), /*#__PURE__*/React.createElement("option", {
    value: "138",
    hidden: true
  }, "VOtAmbi (Medio Ambiente)"), /*#__PURE__*/React.createElement("option", {
    value: "139",
    hidden: true
  }, "VOtOtro (Otros Voluntariados)"), /*#__PURE__*/React.createElement("option", {
    value: "141",
    hidden: true
  }, "DOtDine (Dinero)"), /*#__PURE__*/React.createElement("option", {
    value: "142",
    hidden: true
  }, "DAlAgua (Agua)")), /*#__PURE__*/React.createElement("h2", null, "Donde esta ubicado?"), /*#__PURE__*/React.createElement("div", {
    id: "map"
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Enviar"
  }), /*#__PURE__*/React.createElement("h6", null, props.error)));
};

const FormOrg = props => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: "newPlace",
    onSubmit: props.submit
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_name"
  }, "Nombre:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "name",
    maxLength: "20",
    required: true,
    id: "id_name",
    value: props.data.name,
    onChange: props.setValue
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_phone_number"
  }, "Numero de tel\xE9fono:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "phone_number",
    maxLength: "17",
    required: true,
    id: "id_phone_number",
    value: props.data.phone_number,
    onChange: props.setValue
  }))), /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_short_description"
  }, "Descripci\xF3n:"), /*#__PURE__*/React.createElement("textarea", {
    name: "short_description",
    cols: "40",
    rows: "10",
    maxLength: "300",
    required: true,
    id: "id_short_description",
    value: props.data.short_description,
    onChange: props.setValue
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_quote"
  }, "Lema:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "quote",
    maxLength: "60",
    required: true,
    id: "id_quote",
    value: props.data.quote,
    onChange: props.setValue
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_image"
  }, "Imagen:"), /*#__PURE__*/React.createElement("div", {
    className: "imageOrg"
  }, /*#__PURE__*/React.createElement("div", {
    id: "largeImg"
  }, /*#__PURE__*/React.createElement("img", {
    src: props.data.image
  })), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "image",
    accept: "image/*",
    id: "id_image"
  })), /*#__PURE__*/React.createElement("label", {
    htmlFor: "id_circular_icon"
  }, "Icono circular:"), /*#__PURE__*/React.createElement("div", {
    className: "imageOrg"
  }, /*#__PURE__*/React.createElement("img", {
    src: props.data.circular_icon,
    id: "shortImage"
  }), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "circular_icon",
    accept: "image/*",
    id: "id_circular_icon"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    id: "bigText"
  }, "Fotos de instagram"), /*#__PURE__*/React.createElement("h6", {
    id: "smallText"
  }, "Copia el link de la publicacion de una cuenta publica, asegurate que termine en \"/\""), props.data.instagram_photos.map(photo => {
    return /*#__PURE__*/React.createElement("input", {
      className: "insPhoto",
      type: "url",
      name: "url",
      maxLength: "200",
      required: true,
      id: "id_url",
      value: photo.url,
      onChange: event => props.setInstagram(event, photo.id),
      key: photo.id
    });
  })), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Editar"
  }), /*#__PURE__*/React.createElement("h6", null, props.error)));
}; //I really only do this fuction to not get long jsx-html code in the index.js


const HelpView = props => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "helpInfo"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-question"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Funcionamiento de la p\xE1gina"), /*#__PURE__*/React.createElement("p", null, "Al entrar te aparecer\xE1n todos los lugares que has registrado (si has registrado alguno) con su foto y su nombre, para realizar acciones sobre un lugar tienes que darle click, y despu\xE9s elegir una de las opciones que se explicar\xE1n m\xE1s adelante. Tambi\xE9n se te proporciona una barra de b\xFAsqueda por nombre, y un bot\xF3n de agregar nuevo."))), /*#__PURE__*/React.createElement("div", {
    className: "helpInfo"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Agregar Nuevo"), /*#__PURE__*/React.createElement("p", null, "Al darle click al bot\xF3n en la p\xE1gina principal de dar m\xE1s, se abrir\xE1 un formulario con toda la informaci\xF3n requerida para agregar el nuevo sitio. No es necesario agregar todas las fotos, pero si por lo menos una. Para agregar la ubicaci\xF3n da click en el mapa en donde se encuentre el sitio, esto crear\xE1 un marcador. La barra de busqueda del mapa solo te llevara a un lugar, pero no significa que ese lugar est\xE9 marcado.")), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  })), /*#__PURE__*/React.createElement("div", {
    className: "helpInfo"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Ver sitio"), /*#__PURE__*/React.createElement("p", null, "Al elegir esta opcion despues de darle click a un lugar, se abrir\xE1 la vista que tiene el usuario del sitio. Sin embargo,", /*#__PURE__*/React.createElement("strong", null, " recuerde que los cambios que realice puede no observarse hasta 15 minutos despu\xE9s"), "."))), /*#__PURE__*/React.createElement("div", {
    className: "helpInfo"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Editar sitio"), /*#__PURE__*/React.createElement("p", null, "En la opci\xF3n editar, se cambia la vista a un formulario ya completado con la informaci\xF3n pertinente, es igual que agregar uno nuevo pero la diferencia radica en las fotos. A la derecha de cada campo de fotos puede o no aparecer un n\xFAmero. Si es as\xED, significa que ya tiene una foto en ese campo y que si cambia ese campo la anterior foto va a desaparecer. Puede ver la foto que tiene d\xE1ndole click a ese n\xFAmero. Si no existe dicho n\xFAmero, significa que no se ha agregado una foto en ese campo, y que al hacerlo no eliminar\xE1 ninguna otra.")), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit"
  })), /*#__PURE__*/React.createElement("div", {
    className: "helpInfo"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-line"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Estad\xEDsticas"), /*#__PURE__*/React.createElement("p", null, "Esta opci\xF3n salta un pop-up el cual te da cierto datos sobre el lugar. Explicaremos cada uno a continuaci\xF3n. Las vistas, representan el n\xFAmero de veces que se ha abierto la p\xE1gina de informaci\xF3n del sitio (la misma que aparece cuando le das a ver sitio). Las visitas representan el n\xFAmero de veces que personas han visitado tu sitio fisicamente, han ingresado el c\xF3digo y han sido aprobadas. Los comentarios, representan la cantidad de comentarios que hay en la pagina de informacion. Los puntos generados, representa la cantidad de puntos que suman en total todos los puntos ganados en cada visita. Y las notificaciones son el n\xFAmero de notificaciones que se han generado, tanto aprobadas como no aprobas, incluso baneadas."))), /*#__PURE__*/React.createElement("div", {
    className: "helpInfo"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "C\xF3digo"), /*#__PURE__*/React.createElement("p", null, "Esta opci\xF3n da un pop-up que te muestra el c\xF3digo que le debes dar a quienes visiten tu sitio, de esta manera ellos ganan puntos y registran su actividad. Cuando un usuario ingrese correctamente el codigo, te aparecera una notificacion con su nombre y su foto de perfil. Usted tiene tres opciones. Aprobarlo, lo cual le dar\xE1 los puntos sin ning\xFAn problema. Denegarlo, lo cual le restara los puntos ganados (este cambio se puede ver 15 min despu\xE9s). O banearlo, lo cual adem\xE1s de restarle los puntos le inhabilita la cuenta. ", /*#__PURE__*/React.createElement("strong", null, "Tenga en cuenta que usted solo puede negar o banear con un motivo claro de visita inadecuada. "), "Podemos restringir su cuenta si no cumple con esto.")), /*#__PURE__*/React.createElement("i", {
    className: "fas fa-barcode"
  })), /*#__PURE__*/React.createElement("div", {
    className: "helpInfo"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Eliminar sitio"), /*#__PURE__*/React.createElement("p", null, "Al darle click, le aparecer\xE1 un pop-up para confirmar su acci\xF3n. Si usted dice que no simplemente se cierra el popup. Si usted dice que si toda la informaci\xF3n relacionada con el lugar ser\xE1 eliminada de nuestras bases de datos."))));
};

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim(); // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}