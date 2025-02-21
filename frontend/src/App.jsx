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
import PokemonForm from "./components/pokemon/PokemonForm";
import PokemonEdit from "./components/pokemon/PokemonEdit";
import PokemonDelete from "./components/pokemon/PokemonDelete";
import TrainersList from "./components/trainer/TrainersList";
import TrainerDetail from "./components/trainer/TrainerDetail";
import EditTrainer from "./components/trainer/EditTrainer";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext) || {};
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <AuthStatus />
          <AuthContext.Consumer>
            {({ user, logout }) =>
              user ? <button onClick={logout} style={{ alignSelf: "center" }}>Se déconnecter</button> : null
            }
          </AuthContext.Consumer>
        </div>

        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes privées */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/pokemons" element={<PrivateRoute element={<PokemonList />} />} />
          <Route path="/pokemons/new" element={<PrivateRoute element={<PokemonForm />} />} />
          <Route path="/pokemons/:id" element={<PrivateRoute element={<PokemonDetail />} />} />
          <Route path="/pokemons/edit/:id" element={<PrivateRoute element={<PokemonEdit />} />} />
          <Route path="/pokemons/delete/:id" element={<PrivateRoute element={<PokemonDelete />} />} />

          {/* Routes pour les dresseurs */}
          <Route path="/trainers" element={<PrivateRoute element={<TrainersList />} />} />
          <Route path="/trainer/:id" element={<PrivateRoute element={<TrainerDetail />} />} />
          <Route path="/trainer/edit/:id" element={<PrivateRoute element={<EditTrainer />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
