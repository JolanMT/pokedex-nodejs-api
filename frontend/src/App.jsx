import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import AuthStatus from "./components/AuthStatus";
import PokemonList from "./components/pokemon/PokemonList";
import PokemonDetail from "./components/pokemon/PokemonDetail";
import PokemonForm from './components/pokemon/PokemonForm';
import PokemonEdit from './components/pokemon/PokemonEdit';
import PokemonDelete from './components/pokemon/PokemonDelete';
import "@fortawesome/fontawesome-free/css/all.min.css";


const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext) || {};
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  const { user, logout } = useContext(AuthContext) || {};

  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <AuthStatus />
          {user && (
            <button onClick={logout} style={{ alignSelf: 'center' }}>Se déconnecter</button>
          )}
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pokemons" element={<PokemonList />} />
          <Route path="/pokemons/new" element={<PokemonForm />} />
          {/* <Route path="/pokemons/edit/:id" element={<PokemonForm editMode />} /> */}
          <Route path="/pokemons/:id" element={<PokemonDetail />} />
          <Route path="/pokemons/edit/:id" element={<PokemonEdit />} />
          <Route path="/pokemons/delete/:id" element={<PokemonDelete />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;