
const Result = (props) => {
    return (
        <a href={props.url}><div>
            <h4>{props.name}</h4>
            <h6>{props.organization}</h6>
        </div></a>
    )
};

class App extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            results : []
        };
    };

    search = (query) => {

        fetch('/api/search_helps', {
            method: 'POST',
            credentials: 'same-origin',
            headers :{
                'Content-Type': 'application/json',
                'X-CSRFToken' : document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({'search' : query.target.value})
        }).then(response => response.json())
        .then(data => {
            if (data.error != undefined) {
                console.error('Error in the petition')
            } else {
                this.setState({
                    results: data.results
                });
                // console.log(data);
                console.log(this.state);
            };
        })
    };

    render() {
        return (
            <div>
                <div>
                    <input type="text" id="search" onChange={this.search} autocomplete="off"/>
                    <i className="fas fa-search"></i>
                </div>
                <div>
                    {this.state.results.map(result => {
                        return <Result name={result.name} organization={result.organization} url={result.url} key={result.name}/>
                    })}
                </div>
            </div>
        )
    }
};


ReactDOM.render(
    <App />,
    document.getElementById('react')
);