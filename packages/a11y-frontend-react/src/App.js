import SiteListing from './SiteListing';
import SiteResults from './SiteResults';
import ScanListing from './ScanListing';
import ScanDetails from './ScanDetails';
import Launcher from './Launcher';
import Header from './components/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <main className="App">
        <Switch>
          <Route path="/site-results">
            <SiteResults />
          </Route>
          <Route path="/scan-listing">
            <ScanListing />
          </Route>
          <Route path="/scan-details">
            <ScanDetails />
          </Route>
          <Route path="/launcher">
            <Launcher />
          </Route>
          <Route path={["/", "/site-listing"]}>
            <SiteListing />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
