import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Header() {
  const { user } = useAuth();

  const formatRole = (roleString) => {
    if (!roleString) return "";
    const roleName = roleString.replace("ROLE_", "");
    return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
  };

  const isGestionnaire = user?.role === "ROLE_GESTIONNAIRE";
  const isPrepose = user?.role === "ROLE_PREPOSE" || isGestionnaire;
  const isEmprunteur = user?.role === "ROLE_EMPRUNTEUR" || isGestionnaire;

  return (
    <header className="header">
      <h1>My App</h1>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/about">À propos</Link></li>
          {isEmprunteur && <li><Link to="/emprunteur">Emprunteur</Link></li>}
          {isPrepose && <li><Link to="/prepose">Prepose</Link></li>}
          {isGestionnaire && <li><Link to="/gestionnaire">Gestionnaire</Link></li>}
          <li>{user?.isLoggedIn ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}</li>
        </ul>
        {user?.isLoggedIn && (
          <div className="user-info">
            <p className="para-align">
              Bonjour <span className="user-name">{user.firstName} {user.lastName}</span>
              {user.role && (
                <span className="user-role"> - {formatRole(user.role.toString())}</span>
              )}
            </p>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;