
const Result = (props) => {
    return (
        <a href={props.url} className="result"><div>
            <h4>{props.name}</h4>
            <h6>{props.places} Lugar(es)</h6>
        </div></a>
    )
};

class Results extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            results : []
        };
    };

    search = async (query) => {
        if (query.target.value != "") {
            const response = await fetch('/info/api/organizations', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({'search' : query.target.value})
            });

            const data = await response.json();

            if (data.error != undefined) {
                console.error('Error in the petition')
            } else {
                this.setState({
                    results: data.results
                });
            };
        }
    }

    render() {
        return (
            <div id='content'>
                <input type='text' autoComplete="off" placeholder="Buscar Organizaciones" onChange={this.search} id="serach_bar"/>
                <label htmlFor="serach_bar">Search</label>
                <div id='search_results'>
                    {this.state.results.map(result => {
                        return <Result name={result.name} places={result.number_points} url={result.url} key={result.name}/>
                    })}
                </div>
            </div>
        )
    }
};


ReactDOM.render(
    <Results />,
    document.getElementById('react')
);