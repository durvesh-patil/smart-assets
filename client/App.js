import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './pages/auth'; // Adjust the path as necessary
import Register from './components/Register'; // Adjust the path as necessary
import Login from './components/Login'; // Adjust the path as necessary

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Auth} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                {/* Add other routes as necessary */}
            </Switch>
        </Router>
    );
};

export default App;
