import "./App.css";
import PageLayout from "./components/PageLayout.jsx";
import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import MainContainer from "./components/MainContainer.jsx";
import About from "./components/About.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Logout from "./components/auth/Logout.jsx";
import EmprunteurHome from "./components/page/EmprunteurHome.jsx";
import PreposeHome from "./components/page/PreposeHome.jsx";
import GestionnaireHome from "./components/page/GestionnaireHome.jsx";
import { RequireAuth, RequireRole, useAuth } from "./context/AuthContext.jsx";

function App() {
  const { refreshUser } = useAuth();
  const [error, setError] = useState(null);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<MainContainer setError={setError} />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<LoginForm setError={setError} />} />
          <Route path="logout" element={<Logout />} />
          <Route
            path="emprunteur"
            element={
              <RequireRole allowedRoles={["ROLE_EMPRUNTEUR", "ROLE_GESTIONNAIRE"]}>
                <EmprunteurHome />
              </RequireRole>
            }
          />
          <Route
            path="prepose"
            element={
              <RequireRole allowedRoles={["ROLE_PREPOSE", "ROLE_GESTIONNAIRE"]}>
                <PreposeHome />
              </RequireRole>
            }
          />
          <Route
            path="gestionnaire"
            element={
              <RequireRole allowedRoles={["ROLE_GESTIONNAIRE"]}>
                <GestionnaireHome />
              </RequireRole>
            }
          />
          <Route path="error" element={<ErrorPage error={error} />} />
          <Route
            path="*"
            element={
              <RequireAuth>
                <MainContainer setError={setError} />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
