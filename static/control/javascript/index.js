function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Principal extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "getPlaces", async () => {
      const for_data = await fetch('/control/api/places');
      const data = await for_data.json();
      this.setState({
        'places': data.places,
        'staticPlaces': data.places
      });
    });

    _defineProperty(this, "setSeeTo", to => {
      to == 'new' ? this.setState({
        'see': to
      }, this.showMap) : this.setState({
        'see': to
      }); //Callback if showMap is needed

      this.setState({
        'time': '15:00'
      }); //Restart the clock for help view
    });

    _defineProperty(this, "changeHover", uuid => {
      const index = this.state.places.findIndex(item => item.uuid === uuid);
      let places = [...this.state.places];
      let place = { ...places[index]
      };
      places.forEach(place => place.hover = false);
      place.hover = !place.hover;
      places[index] = place;
      this.setState({
        'places': places
      });
    });

    _defineProperty(this, "setNoPopup", (interval = null) => {
      if (interval != null) {
        clearInterval(interval);
      }

      ;
      this.setState({
        'popupSee': false
      });
    });

    _defineProperty(this, "deleteToServer", async uuid => {
      const for_data = await fetch('/control/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          'uuid': uuid
        })
      });
      const data = await for_data.json();

      if (data.message != undefined) {
        const index = this.state.places.findIndex(item => item.uuid === uuid);
        let places = [...this.state.places];
        places.splice(index, 1);
        this.setState({
          'places': places,
          'popupSee': false
        });
      }

      ;
    });

    _defineProperty(this, "deletePlace", (name, uuid) => {
      this.setState({
        'popup': /*#__PURE__*/React.createElement("div", {
          id: "popupParent"
        }, /*#__PURE__*/React.createElement(PopupDelete, {
          name: name,
          uuid: uuid,
          see: this.setNoPopup,
          delete: this.deleteToServer
        }), /*#__PURE__*/React.createElement("div", {
          id: "background"
        })),
        'popupSee': true
      });
    });

    _defineProperty(this, "ban", async notificationId => {
      await fetch('/control/api/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          'id': notificationId
        })
      });
    });

    _defineProperty(this, "discardNotify", async (id, aproved) => {
      await fetch('/control/api/checknotify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          'id': id,
          'aproved': aproved
        })
      });
    });

    _defineProperty(this, "getCode", async (intervalCode, name, uuid) => {
      const for_data = await fetch('/control/api/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          'uuid': uuid
        })
      });
      const data = await for_data.json();

      if (data.code != undefined) {
        this.setState({
          'popup': /*#__PURE__*/React.createElement("div", {
            id: "popupParent"
          }, /*#__PURE__*/React.createElement(PopupCode, {
            name: name,
            uuid: uuid,
            see: () => this.setNoPopup(intervalCode),
            code: data.code,
            notifications: data.notifications,
            discard: this.discardNotify,
            ban: this.ban
          }), /*#__PURE__*/React.createElement("div", {
            id: "background"
          })),
          'popupSee': true
        });
      }
    });

    _defineProperty(this, "showCode", (name, uuid) => {
      var intervalCode = setInterval(() => this.getCode(intervalCode, name, uuid), 2000); //Renew Code

      this.getCode(intervalCode, name, uuid); //For not wait 2 seconds
    });

    _defineProperty(this, "setValueForm", event => {
      //Set value to state, in order to submit later
      let data = { ...this.state.form
      };
      data[event.target.name] = event.target.value;
      this.setState({
        'form': data
      });
    });

    _defineProperty(this, "setValueOrgForm", event => {
      let data = { ...this.state.orgForm
      };
      data[event.target.name] = event.target.value;
      this.setState({
        'orgForm': data
      });
    });

    _defineProperty(this, "newPlaceSubmit", async (event, photoIds, edit) => {
      //Most large function, sorry dude
      event.preventDefault();
      const dataSubmit = { ...this.state.form
      }; //Doing Checks

      let checked = true;

      if (dataSubmit.latitude === 0 & dataSubmit.longitude === 0) {
        //Not coordinates entered
        checked = false;
        this.setState({
          'formError': 'Se nececita poner unas coordenadas'
        });
      }

      ; //Categories checks

      const categoryContent = document.querySelector(`#id_category option[value="${dataSubmit.category}"]`).textContent;
      const subContent = document.querySelector(`#id_sub_category option[value="${dataSubmit.sub_category}"]`).textContent;

      if (dataSubmit.mayor_category != categoryContent[0] || categoryContent.slice(0, 3) != subContent.slice(0, 3)) {
        checked = false;
        this.setState({
          'formError': 'Categorias Incorrectas'
        });
      } //Check one photo

      if (checked) {
        const fileFields = document.querySelectorAll("#newPlace input[type='file']");

        for (let i = 0; i < fileFields.length; i++) {
          //Upload every new photo
          const file = fileFields[i].files[0];

          if (file != undefined) {
            //Delete previus photo
            if (edit) {
              await fetch('/control/api/deletephoto', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                  'id': photoIds[i]
                })
              });
            }

            ;
            const formPhoto = new FormData();
            formPhoto.append('photo', file);
            formPhoto.append("csrfmiddlewaretoken", getCookie('csrftoken')); // I hate this

            const for_data = await fetch('/control/api/uploadphoto', {
              method: 'POST',
              body: formPhoto
            });
            const data = await for_data.json();

            if (data.error !== undefined) {
              this.setState({
                'formError': data.error
              });
            } else {
              photoIds[i] = data.id;
            }

            ;
          }

          ;
        }

        ;
        let formPlace = new FormData();
        formPlace.append("csrfmiddlewaretoken", getCookie('csrftoken')); // I hate this

        for (const key in dataSubmit) {
          //Append all the info
          formPlace.append(key, dataSubmit[key]);
        }

        ;
        photoIds.forEach(photo => {
          if (photo != null) {
            formPlace.append('photos', photo); //All the photos send like the same "photos"
          }
        });
        const directionToUpload = edit ? '/control/api/editplace' : '/control/api/uploadplace';
        const for_data = await fetch(directionToUpload, {
          method: 'POST',
          body: formPlace
        });
        const data = await for_data.json();

        if (data.error !== undefined) {
          //If error show error
          this.setState({
            'formError': data.error
          });
        } else {
          this.getPlaces(); //Get the new place

          this.setState({
            'formError': null,
            'see': 'places',
            'form': {
              'mayor_category': 'D',
              'category': 10,
              'sub_category': 71,
              'latitude': 0,
              'longitude': 0
            }
          }); //No error message, no see place, reset form
        }

        ;
      }
    });

    _defineProperty(this, "dontShowCategories", event => {
      const mayor_category = event.target.value === 'D' ? 'V' : 'D'; //Return the contrary

      let categories = document.querySelectorAll('#id_category option');
      categories.forEach(category => {
        if (category.textContent[0] == mayor_category) {
          category.setAttribute('hidden', '');
        } else {
          category.removeAttribute('hidden');
        }

        ;
      });
    });

    _defineProperty(this, "dontShowSubCategories", event => {
      const category = document.querySelector(`#id_category option[value="${event.target.value}"]`).textContent.slice(0, 3); //Get the code of the category (like DAl)

      let sub_categories = document.querySelectorAll('#id_sub_category option');
      sub_categories.forEach(sub_category => {
        if (sub_category.textContent.slice(0, 3) == category) {
          sub_category.removeAttribute('hidden');
        } else {
          sub_category.setAttribute('hidden', '');
        }

        ;
      });
    });

    _defineProperty(this, "showMap", (latitude = null, longitude = null) => {
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';
      const map = new mapboxgl.Map({
        container: 'map',
        //No exist yet I really dont know hot to solve this
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        // starting position
        zoom: 1 // starting zoom

      });
      map.addControl( //Add search bar
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
      }));

      if (latitude != null & longitude != null) {
        //For edit place
        var marker = new mapboxgl.Marker({}).setLngLat([longitude, latitude]).addTo(map);
      } else {
        var marker = new mapboxgl.Marker({}); //Only to not get error
      }

      map.on('click', e => {
        marker.remove(); //Delete current marker

        const coordinates = e.lngLat.wrap();
        marker = new mapboxgl.Marker().setLngLat([coordinates.lng, coordinates.lat]).addTo(map); //Add to info state

        let formInfo = { ...this.state.form
        };
        formInfo.latitude = coordinates.lat.toFixed(8);
        formInfo.longitude = coordinates.lng.toFixed(8);
        this.setState({
          'form': formInfo
        });
      });
    });

    _defineProperty(this, "searchPlace", e => {
      e.preventDefault();
      const search = e.target.value.toLowerCase(); //Lower case to not differ bewtween capital and normal letters

      const staticPlaces = [...this.state.staticPlaces];
      const newPlaces = staticPlaces.filter(place => place.name.toLowerCase().includes(search)); //Show places that have the substring, same reason to lowercase

      this.setState({
        'places': newPlaces
      });
    });

    _defineProperty(this, "setToEdit", async uuid => {
      const for_data = await fetch('/control/api/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          'uuid': uuid
        })
      });
      const data = await for_data.json();
      this.setState({
        'form': data.form,
        'forPhotos': data.photosId,
        'see': 'edit'
      }, () => this.showMap(data.form.latitude, data.form.longitude)); //Set map with the coordinates
    });

    _defineProperty(this, "showInfo", async (name, uuid) => {
      const for_data = await fetch('/control/api/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          'uuid': uuid
        })
      });
      const data = await for_data.json();
      this.setState({
        'popup': /*#__PURE__*/React.createElement("div", {
          id: "popupParent"
        }, /*#__PURE__*/React.createElement(PopUpInfo, {
          see: this.setNoPopup,
          name: name,
          data: data
        }), /*#__PURE__*/React.createElement("div", {
          id: "background"
        })),
        'popupSee': true
      });
    });

    _defineProperty(this, "getTime", () => {
      const time = this.state.time;
      let [minutes, seconds] = time.split(':');
      minutes = parseFloat(minutes);
      seconds = parseFloat(seconds);
      let total = minutes * 60 + seconds;
      total -= 1;

      if (total === 0) {
        total = 900; //Restart the clock when is zero
      }

      minutes = Math.floor(total / 60);
      seconds = total % 60; //Adding zeros

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      this.setState({
        'time': `${minutes}:${seconds}`
      });
    });

    _defineProperty(this, "toOrg", async () => {
      const for_data = await fetch('/control/api/org');
      const data = await for_data.json();
      this.setState({
        'orgForm': data,
        'see': 'org'
      });
    });

    _defineProperty(this, "setInstagram", (event, id) => {
      let formData = [...this.state.orgForm.instagram_photos];
      let to_edit = formData.find(photo => photo.id == id);
      const index = formData.findIndex(photo => photo.id == id);
      to_edit.url = event.target.value;
      formData[index] = to_edit;
      let orgData = { ...this.state.orgForm
      };
      orgData.instagram_photos = formData;
      this.setState({
        'orgForm': orgData
      });
    });

    _defineProperty(this, "submitOrg", async e => {
      e.preventDefault();
      let data = { ...this.state.orgForm
      };
      const photos = data.instagram_photos;
      let check = true; //Edit photos

      for (let i = 0; i < photos.length; i++) {
        if (photos[i].url != "") {
          let formPhoto = new FormData();
          formPhoto.append("csrfmiddlewaretoken", getCookie('csrftoken'));
          formPhoto.append("id", photos[i].id);
          formPhoto.append("url", photos[i].url);
          const for_data = await fetch('/control/api/editInstagram', {
            method: "POST",
            body: formPhoto
          });
          const data = await for_data.json();

          if (data.error != undefined) {
            check = false;
            this.setState({
              "formError": "Algun campo de fotos de instagram es incorrecto"
            });
            break;
          }
        } else {
          check = false;
          this.setState({
            "formError": "Algun campo de fotos de instagram esta vacio"
          });
          break;
        }
      }

      if (check) {
        let formOrg = new FormData();
        formOrg.append("csrfmiddlewaretoken", getCookie('csrftoken')); //Photos

        const imageField = document.querySelector("#id_image").files[0];
        formOrg.append("image", imageField);
        const circularField = document.querySelector("#id_circular_icon").files[0];
        formOrg.append("circular_icon", circularField); //Rest

        for (const key in data) {
          if (key != "instagram_photos" & key != "image" & key != "circular_icon") {
            formOrg.append(key, data[key]);
          }

          ;
        }

        ;
        const for_data = await fetch('/control/api/editOrg', {
          method: "POST",
          body: formOrg
        });
        const responseData = await for_data.json();

        if (responseData.error != undefined) {
          this.setState({
            "formError": responseData.error
          });
        } else {
          this.setSeeTo('places');
        }
      }

      ;
    });

    this.state = {
      'staticPlaces': [],
      'places': [],
      'popupSee': false,
      'popup': null,
      'see': 'places',
      'form': {
        'mayor_category': 'D',
        'category': 10,
        'sub_category': 71,
        'latitude': 0,
        'longitude': 0
      },
      'formError': null,
      'forPhotos': [],
      'time': '15:00',
      'orgForm': {}
    };
    this.getPlaces();
    setInterval(this.getTime, 1000); //To the clock
  }

  render() {
    let see = null;

    switch (this.state.see) {
      case "places":
        see = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          id: "superiorInfo"
        }, /*#__PURE__*/React.createElement("input", {
          type: "text",
          placeholder: "Buscar",
          onChange: this.searchPlace,
          id: "searchBar"
        }), /*#__PURE__*/React.createElement("div", {
          id: "add",
          onClick: () => this.setSeeTo('new')
        }, "A\xF1adir Nuevo ", /*#__PURE__*/React.createElement("i", {
          className: "fas fa-plus"
        }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          id: "places"
        }, this.state.places.map(place => {
          return /*#__PURE__*/React.createElement(Place, {
            name: place.name,
            image: place.image,
            url: place.url,
            hover: place.hover,
            to_hover: this.changeHover,
            delete: this.deletePlace,
            uuid: place.uuid,
            forCode: this.showCode,
            toEdit: this.setToEdit,
            showInfo: this.showInfo,
            key: place.uuid
          });
        }))), this.state.popupSee ? this.state.popup : null);
        break;

      case "new":
        see = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
          id: "createTitle"
        }, "Crear un nuevo lugar"), /*#__PURE__*/React.createElement(FormPlaces, {
          submit: this.newPlaceSubmit,
          setValue: this.setValueForm,
          dontShowCate: this.dontShowCategories,
          dontShowSub: this.dontShowSubCategories,
          error: this.state.formError,
          default: {},
          edit: false,
          photos: [null, null, null, null]
        }));
        break;

      case "edit":
        see = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
          id: "createTitle"
        }, "Editar Lugar"), /*#__PURE__*/React.createElement(FormPlaces, {
          submit: this.newPlaceSubmit,
          setValue: this.setValueForm,
          dontShowCate: this.dontShowCategories,
          dontShowSub: this.dontShowSubCategories,
          error: this.state.formError,
          default: this.state.form,
          edit: true,
          photos: this.state.forPhotos
        }));
        break;

      case "help":
        see = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          id: "clock"
        }, /*#__PURE__*/React.createElement("i", {
          className: "fas fa-clock"
        }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Recuerda que cualquier cambio no se ver\xE1 en menos de"), /*#__PURE__*/React.createElement("h3", {
          id: "minutes"
        }, this.state.time, " minutos"))), /*#__PURE__*/React.createElement(HelpView, null));
        break;

      case "org":
        see = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
          id: "createTitle"
        }, "Editar Organizaci\xF3n"), /*#__PURE__*/React.createElement(FormOrg, {
          data: this.state.orgForm,
          setValue: this.setValueOrgForm,
          setInstagram: this.setInstagram,
          error: this.state.formError,
          submit: this.submitOrg
        }));
        break;
    }

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      id: "navigation"
    }, /*#__PURE__*/React.createElement("h1", null, "Small Actions - Control"), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("a", {
      onClick: () => this.setSeeTo('places')
    }, "Lugares"), /*#__PURE__*/React.createElement("a", {
      onClick: this.toOrg
    }, "Organizaci\xF3n"), /*#__PURE__*/React.createElement("a", {
      onClick: () => this.setSeeTo('help')
    }, "Ayuda"))), see);
  }

}

;
ReactDOM.render( /*#__PURE__*/React.createElement(Principal, null), document.getElementById('react'));