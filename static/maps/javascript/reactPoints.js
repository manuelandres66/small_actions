function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Result = props => {
  return /*#__PURE__*/React.createElement("a", {
    href: props.url,
    className: "result"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, props.name), /*#__PURE__*/React.createElement("h6", null, props.organization)));
};

class App extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "search", query => {
      if (query.target.value != "") {
        fetch('/api/search_helps', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
          },
          body: JSON.stringify({
            'search': query.target.value
          })
        }).then(response => response.json()).then(data => {
          if (data.error != undefined) {
            console.error('Error in the petition');
          } else {
            this.setState({
              results: data.results
            }); // console.log(data);

            console.log(this.state);
          }

          ;
        });
      }

      ;
    });

    this.state = {
      results: []
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      id: "searchBar"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "search",
      onChange: this.search,
      autoComplete: "off",
      placeholder: "Buscar Lugares"
    }), /*#__PURE__*/React.createElement("div", {
      id: "search_container"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-search",
      id: "search"
    }))), /*#__PURE__*/React.createElement("div", {
      id: "results"
    }, this.state.results.map(result => {
      return /*#__PURE__*/React.createElement(Result, {
        name: result.name,
        organization: result.organization,
        url: result.url,
        key: result.name
      });
    })));
  }

}

;
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('react'));