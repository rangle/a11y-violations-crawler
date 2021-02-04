import SiteListing from './SiteListing';
import SiteDetails from './SiteDetails';
import ScanListing from './ScanListing';
import ScanDetails from './ScanDetails';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/site-details">
            <SiteDetails />
          </Route>
          <Route path="/scan-listing">
            <ScanListing />
          </Route>
          <Route path="/scan-details">
            <ScanDetails />
          </Route>
          <Route path="/">
            <SiteListing />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
