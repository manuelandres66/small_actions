
const Result = (props) => {
    return (
        <a href={props.url} className="result"><div>
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
        
        if (query.target.value != ""){
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
    };

    render() {
        return (
            <div>
                <div id="searchBar">
                    <input type="text" id="search" onChange={this.search} autoComplete="off" placeholder="Search Help Points"/>
                    <div id="search_container">
                        <i className="fas fa-search" id="search"></i>
                    </div>
                </div>
                <div id="results">
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