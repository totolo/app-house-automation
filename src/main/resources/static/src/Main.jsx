var { Router, Route, Link, hashHistory, IndexRoute } = ReactRouter;
var env;
/********************************************************
 * Components
 *********************************************************/

/*****************
 * Trigger Tables
 *****************/
class MainDiv extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }
  // componentDidMount() {
  //   fetchDataAndSetState('/admin/triggers', this)
  // }
  render() {
    var self = this;
    return (
        <div>
          <h1>Home Automation</h1>
          <div className="bg-info">
            {self.state.message}
          </div>
          <div>
            <div>control panel</div>
            <ControlPanelButton deviceType="light" parent={self}/>
            <ControlPanelButton deviceType="curtain" parent={self}/>
            <ControlPanelSlider deviceType="temperature" parent={self}/>
          </div>
        </div>
    );
  }
}


class ControlPanelButton extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      value: false
    };

    this.fireRequest = this.fireRequest.bind(this);
  }
  fireRequest(deviceType) {
    var requestedState = !this.state.value;

    setProperty(deviceType, requestedState, this, this.props.parent);
  }
  render() {
    var self = this;
    return (
        <div>
          <button onClick={self.fireRequest.bind(self, self.props.deviceType)}
                  className="btn btn-primary">
            {self.props.deviceType} is {self.state.value.toString()}
          </button>
          <div style={{backgroundColor: self.state.value ? "yellow" : "black"}}>{self.state.value.toString()}</div>
        </div>

    );}
}

class ControlPanelSlider extends React.Component{
  constructor(props) {
    super(props);

    // default to a comfortable 70 degrees
    this.state = {
      value: 90
    };

    this.handleChange = this.handleChange.bind(this);
    this.fireRequest = this.fireRequest.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    // debounce the slider since we don't want to send request for every
    // value dragged over!
    this.debounceCall = _.debounce(this.fireRequest, 500);
  }
  componentDidMount() {
    var self = this;
    fetch('/temperature')
        .then(function(response) {
          return response.text();
        })
        .then(function(temp) {
          self.setState({value: temp});
        });
  }
  fireRequest(deviceType) {
    var self = this;
    setProperty(deviceType, self.state.value, self, self.props.parent);
    console.log("firing request! thsi shouldnt happen often ", deviceType);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
    this.debounceCall("temperature");
  }

  render() {
    var self = this;
    return (
        <div className="col-xs-2 success">
          {this.state.message}
          <div>{self.state.value}</div>
          <input type="range" id="myRange" min="60" max="90" value={this.state.value} onChange={self.handleChange}>
          </input>
        </div>
    );}
}



/********************************************************
 * Api Call Helpers
 *********************************************************/

function setProperty(deviceType, value, self, parent) {
  return fetch('/set/' + deviceType,
      {
        method: 'POST',
        body: JSON.stringify({value: value}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        self.setState({
          value: json.value
        });
        parent.setState({
          message: json.message
        })
      });
}


/********************************************************
 * Immediate Execute
 *********************************************************/

fetch('/all')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log("json for all", json)
    });


ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={MainDiv}>
        <IndexRoute component={MainDiv}/>
        {/*<Route path="/triggers" component={MainTriggerTable}/>*/}
        {/*<Route path="/triggers/history/:triggerType/:triggerId" component={IndividualTriggerTable}/>*/}
        {/*<Route path="/events" component={MainEventTable}/>*/}
      </Route>
    </Router>
), document.getElementById('container'));


