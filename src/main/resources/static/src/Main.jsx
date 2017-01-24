var { Router, Route, Link, hashHistory, IndexRoute } = ReactRouter;
var env;
/********************************************************
 * Components
 *********************************************************/

/*****************
 * Trigger Tables
 *****************/
class MainTriggerTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      mainTableData: [],
      footnotes: {
        expectationsMessage: "Note: Keys in red are expectations which should have been fired but haven't yet.",
        skippedFiresMessage: "Keys in blue are skipped fires (i.e. cleared expectations)."
      }
    };
  }
  componentDidMount() {
    fetchDataAndSetState('/admin/triggers', this)
  }
  render() {
    var self = this;
    return (
        <div>
          <h1>Home Automation</h1>
          <div className="bg-info">
            {self.state.fireResponse}
          </div>
          <div>
            <div>control panel</div>
            <ControlPanelButton deviceType="light"/>
            <ControlPanelButton deviceType="curtain"/>
            <ControlPanelSlider deviceType="curtain"/>
            <button>Temperature</button>
          </div>
        </div>
    );
  }
}

class IndividualTriggerTable extends MainTriggerTable{
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    var triggerType = this.props.params.triggerType;
    var triggerId = this.props.params.triggerId;

    fetchDataAndSetState('/admin/history/' + triggerType + "/" + triggerId, this)
  }
  render() {
    var self = this;
    return (
        <div>
          <h2>History for   {self.props.params.triggerId}, {self.props.params.triggerType}</h2>
          <div className="bg-info">
            {self.state.fireResponse}
          </div>
          <table className="table table-striped">
            <thead>
            <tr>
              {_.map(['Key', 'Fire Time', 'Allocation Time', 'Retrigger'], function(title) {
                return <th key={title}>{title}</th>;
              })}
            </tr>
            </thead>
            <tbody>
            {_.map(self.state.mainTableData, function(row, i) {
              var style = {color: getColorForRowType(row)};
              return (
                  <tr key={i}>
                    <td style={style}>{formatKeyForDisplay(row.key)}</td>
                    <td>{row.time}</td>
                    <td>{row.allocationTime}</td>
                    <td>
                      { row.history ?
                          <FireButton triggerInfo={self.props.params} keyObj={row.key} parent={self} /> :
                          <div>
                            <ClearButton triggerInfo={self.props.params} keyObj={row.key} parent={self} clearTime={row.time} isClearAll="false" /> &nbsp;
                            <FireButton triggerInfo={self.props.params} keyObj={row.key} parent={self} />
                          </div>
                      }
                    </td>
                  </tr>
              );
            })}
            </tbody>
          </table>
        </div>
    );
  }
}

class ControlPanelButton extends React.Component{
  constructor(props) {
    super(props);

    // default to a comfortable 70 degrees
    this.state = {
      value: false
    };

  }
  fireRequest(deviceType) {
    setProperty(deviceType, true, this);
    console.log(deviceType, "heyhye")
  }
  render() {
    var self = this;
    return (
        <button onClick={self.fireRequest.bind(self.props.parent,  self.props.deviceType)}
                className="btn btn-primary">
          {self.props.deviceType}
        </button>
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

    // debounce the slider since we don't want to send request for every
    // value dragged over!
    this.submitFunc = _.debounce(this.fireRequest, 500);
  }
  fireRequest(deviceType, a, b, c) {
    // fireTriggerAndSetState(triggerType, triggerId, key, this);
    console.log("firing request! thsi shouldnt happen often ", deviceType);
  }
  handleChange(event, hey, hey2) {
    console.log("event target value", event.target.value, hey, hey2);
    this.setState({value: event.target.value});
    this.submitFunc("temperature");
  }

  render() {
    var self = this;
    return (
        <div className="col-xs-2 success">
          <div>{self.state.value}</div>
          <input type="range" id="myRange" min="60" max="90" value={this.state.value} onChange={self.handleChange}>
          </input>
        </div>
    );}
}



/********************************************************
 * Api Call Helpers
 *********************************************************/

function fetchDataAndSetState(url, self) {
  fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        self.setState({
          mainTableData : json
        });
      })
      .catch(function(ex) {
        console.warn('parsing failed', ex)
      });
}

function setProperty(deviceType, value, self) {
  return fetch('/set/' + deviceType,
      {
        method: 'POST',
        body: JSON.stringify({state: value}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(response) {
        return response.text();
      })
      .then(function(message) {
        self.setState({
          fireResponse: message
        });
      });
}




/********************************************************
 * Utility Functions
 *********************************************************/

function formatKeyForDisplay(keyObj) {
  return _.map(keyObj, function(value, key) {
    return key + ": " + value;
  }).join(", ");
}



function getColorForRowType(row) {
  if(row.skipped) {
    return "blue";
  } else if (!row.history) {
    return  "red";
  }
  return "black";

}


/********************************************************
 * Immediate Execute
 *********************************************************/

fetch('/light')
    .then(function(response) {
      return response.text();
    })
    .then(function(text) {
      env = _.toUpper(text);
    });

ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={MainTriggerTable}>
        <IndexRoute component={MainTriggerTable}/>
        {/*<Route path="/triggers" component={MainTriggerTable}/>*/}
        {/*<Route path="/triggers/history/:triggerType/:triggerId" component={IndividualTriggerTable}/>*/}
        {/*<Route path="/events" component={MainEventTable}/>*/}
      </Route>
    </Router>
), document.getElementById('container'));


