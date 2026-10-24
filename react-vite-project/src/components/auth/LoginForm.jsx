import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginForm = ({ setError }) => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [warnings, setWarnings] = useState({
    email: "",
    password: "",
  });

  const validateUser = () => {
    let isValid = true;
    const updatedWarnings = { ...warnings };

    if (!validateEmail()) {
      updatedWarnings.email = "courriel invalide";
      isValid = false;
    } else {
      updatedWarnings.email = "";
    }

    if (!validatePassword()) {
      updatedWarnings.password = "mot de passe invalide";
      isValid = false;
    } else {
      updatedWarnings.password = "";
    }

    setWarnings(updatedWarnings);
    return isValid;
  };

  const validateEmail = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(formData.email);
  };

  const validatePassword = () => {
    return formData.password.trim().length > 0;
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setWarnings((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUser()) {
      return;
    }

    try {
      const userData = await login({
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      const role = userData.role;
      if (role === "ROLE_EMPRUNTEUR") {
        navigate("/emprunteur");
      } else if (role === "ROLE_PREPOSE") {
        navigate("/prepose");
      } else if (role === "ROLE_GESTIONNAIRE") {
        navigate("/gestionnaire");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError?.(error);
      navigate("/error");
    }
  };

  if (user?.isLoggedIn) {
    const role = user.role;
    if (role === "ROLE_EMPRUNTEUR") {
      navigate("/emprunteur");
      return null;
    }
    if (role === "ROLE_PREPOSE") {
      navigate("/prepose");
      return null;
    }
    if (role === "ROLE_GESTIONNAIRE") {
      navigate("/gestionnaire");
      return null;
    }
    navigate("/");
    return null;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-6 text-center mb-3">Projet Etudiant</h1>

      <div className="row">
        <div className="col-9 mx-auto">
          <form id="login-form" className="form-group" onSubmit={handleSubmit}>
            <label htmlFor="email" className="mt-3">email</label>
            <input
              id="email"
              type="email"
              className={`form-control ${warnings.email ? "is-invalid" : ""}`}
              placeholder="placeHolderEmail"
              name="email"
              value={formData.email}
              onChange={handleChanges}
              required
            />
            <div className="text-danger">{warnings.email}</div>

            <label htmlFor="password" className="mt-3">password</label>
            <input
              id="password"
              type="password"
              className={`form-control ${warnings.password ? "is-invalid" : ""}`}
              placeholder="placeHolderPassword"
              name="password"
              value={formData.password}
              onChange={handleChanges}
              required
            />
            <div className="text-danger">{warnings.password}</div>

            <div className="row col-6 mx-auto">
              <button type="submit" className="btn btn-outline-ose my-5 mx-auto">loginSubmit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
