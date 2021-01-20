var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Result = function Result(props) {
    return React.createElement(
        "a",
        { href: props.url, className: "result" },
        React.createElement(
            "div",
            null,
            React.createElement(
                "h4",
                null,
                props.name
            ),
            React.createElement(
                "h6",
                null,
                props.organization
            )
        )
    );
};

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.search = function (query) {

            if (query.target.value != "") {
                fetch('/api/search_helps', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: JSON.stringify({ 'search': query.target.value })
                }).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    if (data.error != undefined) {
                        console.error('Error in the petition');
                    } else {
                        _this.setState({
                            results: data.results
                        });
                        // console.log(data);
                        console.log(_this.state);
                    };
                });
            };
        };

        _this.state = {
            results: []
        };
        return _this;
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { id: "searchBar" },
                    React.createElement("input", { type: "text", id: "search", onChange: this.search, autoComplete: "off", placeholder: "Buscar Lugares" }),
                    React.createElement(
                        "div",
                        { id: "search_container" },
                        React.createElement("i", { className: "fas fa-search", id: "search" })
                    )
                ),
                React.createElement(
                    "div",
                    { id: "results" },
                    this.state.results.map(function (result) {
                        return React.createElement(Result, { name: result.name, organization: result.organization, url: result.url, key: result.name });
                    })
                )
            );
        }
    }]);

    return App;
}(React.Component);

;

ReactDOM.render(React.createElement(App, null), document.getElementById('react'));