import _regeneratorRuntime from 'babel-runtime/regenerator';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        var _this2 = this;

        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.newMap = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
            var response, data, mapConfig, map, track, features;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsMTJhdm8iLCJhIjoiY2tneWE3eWFhMGZjdjJ4bjUxaXR0cTBnNSJ9.c5ue5ns5clGrxZoG6WiEsw';

                            _context.next = 3;
                            return fetch('/api/all_helps', {
                                method: 'POST',
                                credentials: 'same-origin',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                                },
                                body: JSON.stringify({ 'data': 'all' })
                            });

                        case 3:
                            response = _context.sent;
                            _context.next = 6;
                            return response.json();

                        case 6:
                            data = _context.sent;
                            mapConfig = {
                                container: 'map',
                                style: 'mapbox://styles/mapbox/streets-v11',
                                center: [data.longitude, data.latitude] // starting position
                            };


                            mapConfig.zoom = data.user ? 14 : 1;

                            map = new mapboxgl.Map(mapConfig);

                            map.addControl(new mapboxgl.NavigationControl());

                            // Geolocalizacion
                            track = new mapboxgl.GeolocateControl({
                                positionOptions: {
                                    enableHighAccuracy: true
                                },
                                trackUserLocation: true
                            });

                            map.addControl(track, 'top-left');

                            //Fullscreen
                            map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

                            // Agregando puntos

                            features = [];

                            data.points.forEach(function (point) {
                                var newPoint = {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': point.cordinates
                                    },
                                    'properties': {
                                        'title': point.name,
                                        'category': point.category,
                                        'organization': point.organization,
                                        'description': point.description,
                                        'rute': point.rute,
                                        'uuid': point.uuid
                                    }
                                };
                                features.push(newPoint);
                            });

                            map.on('load', function () {
                                //Change Lenguage
                                map.setLayoutProperty('country-label', 'text-field', ['get', "name_es"]);

                                //Points
                                map.loadImage('/static/maps/images/point.png', function (error, image) {
                                    if (error) throw error;
                                    map.addImage('pointer', image);

                                    map.addSource('points', {
                                        'type': 'geojson',
                                        'data': {
                                            'type': 'FeatureCollection',
                                            'features': features
                                        }
                                    });

                                    map.addLayer({
                                        'id': 'points',
                                        'type': 'symbol',
                                        'source': 'points',
                                        'layout': {
                                            'icon-image': 'pointer',
                                            'icon-size': 1,

                                            // get the title name from the source's "title" property
                                            'text-field': ['get', 'title'],
                                            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                                            'text-offset': [0, 1.2],
                                            'text-anchor': 'top'
                                        }
                                    });
                                });
                            });

                            map.on('click', 'points', function (e) {
                                var properties = e.features[0].properties;
                                _this.changeState(properties.title, properties.category, properties.organization, properties.description, properties.rute, properties.uuid);
                            });

                        case 18:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this2);
        }));

        _this.changeState = function (name, type, organization, description, url, uuid) {
            _this.setState({
                name: name,
                type: type,
                organization: organization,
                description: description,
                url: url,
                uuid: uuid
            });
        };

        _this.state = {
            name: "¡Bienvenido a Small Actions!",
            type: 'Web de ayuda',
            organization: 'Small Actions',
            description: "Bienvenido a Small Actions una página web sobre ayudar a los demás, para iniciar, da click en un sitio en el mapa de tu izquierda, esta sección cambiará con la información del lugar, y los botones de abajo te llevarán a páginas con más información o con la ruta para visitar el lugar. Por favor haz una cuenta antes de nada para guardar tu progreso. ¡Ayuda a los demás y gana puntos!.",
            url: "#",
            uuid: "#"
        };
        _this.newMap();
        return _this;
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { id: 'info_point' },
                React.createElement(
                    'div',
                    { id: 'non_button' },
                    React.createElement(
                        'h1',
                        null,
                        this.state.name
                    ),
                    React.createElement(
                        'div',
                        { id: 'grid_info' },
                        React.createElement(
                            'div',
                            { className: 'info_grid' },
                            React.createElement(
                                'h6',
                                null,
                                'Categoria:'
                            ),
                            React.createElement(
                                'h6',
                                null,
                                'Organizaci\xF3n:'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'info_grid', id: 'info_type' },
                            React.createElement(
                                'h6',
                                null,
                                this.state.type
                            ),
                            React.createElement(
                                'h6',
                                null,
                                this.state.organization
                            )
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        this.state.description
                    )
                ),
                React.createElement(
                    'div',
                    { id: 'button' },
                    React.createElement(
                        'a',
                        { href: this.state.uuid },
                        React.createElement(
                            'button',
                            { id: 'more_info' },
                            'Informaci\xF3n'
                        )
                    ),
                    React.createElement(
                        'a',
                        { href: this.state.url },
                        React.createElement(
                            'button',
                            { id: 'view_rute' },
                            'Ver Ruta'
                        )
                    )
                )
            );
        }
    }]);

    return App;
}(React.Component);

;

ReactDOM.render(React.createElement(App, null), document.getElementById('react'));