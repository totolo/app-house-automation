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
  render() {
    var self = this;
    return (
        <div>
          <h1>Home Automation</h1>
          <div className="bg-info" style={{width: "300px"}}>
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
                  className="btn btn-primary"
                  style={{width : "120px"}}>
            {self.props.deviceType} is {self.state.value ? 'on' : 'off'}
          </button>
          <div className="col-xs-2 btn" style={{backgroundColor: self.state.value ? "yellow" : "black"}}>{self.state.value ? 'on' : 'off'}</div>
          <br/>
        </div>

    );}
}

class ControlPanelSlider extends React.Component{
  constructor(props) {
    super(props);

    // default to a comfortable 70 degrees
    this.state = {
      value: 70
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
        <div className="col-xs-2">

          <input className="col-xs-2"
                 type="range" id="myRange" min="60" max="90"
                 style={{top:"5px"}} value={this.state.value} onChange={self.handleChange}/>
          <div>{self.state.value}</div>
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
      </Route>
    </Router>
), document.getElementById('container'));


