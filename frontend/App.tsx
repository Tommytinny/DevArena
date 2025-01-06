// src/App.tsx
import React from react;
import { BrowserRouter as Router, Route, Switch } from react-router-dom;
import { AuthProvider } from ./context/authContext;
import LoginPage from ./components/LoginPage;
import ProtectedPage from ./components/ProtectedPage;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/protected" component={ProtectedPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;

