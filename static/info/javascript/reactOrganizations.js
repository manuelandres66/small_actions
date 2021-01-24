function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Result = props => {
  return React.createElement("a", {
    href: props.url,
    className: "result"
  }, React.createElement("div", null, React.createElement("h4", null, props.name), React.createElement("h6", null, props.places, " Lugar(es)")));
};

class Results extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "search", async query => {
      if (query.target.value != "") {
        const response = await fetch('/info/api/organizations', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
          },
          body: JSON.stringify({
            'search': query.target.value
          })
        });
        const data = await response.json();

        if (data.error != undefined) {
          console.error('Error in the petition');
        } else {
          this.setState({
            results: data.results
          });
        }

        ;
      }
    });

    this.state = {
      results: []
    };
  }

  render() {
    return React.createElement("div", {
      id: "content"
    }, React.createElement("input", {
      type: "text",
      autoComplete: "off",
      placeholder: "Buscar Organizaciones",
      onChange: this.search
    }), React.createElement("div", {
      id: "search_results"
    }, this.state.results.map(result => {
      return React.createElement(Result, {
        name: result.name,
        places: result.number_points,
        url: result.url,
        key: result.name
      });
    })));
  }

}

;
ReactDOM.render( React.createElement(Results, null), document.getElementById('react'));