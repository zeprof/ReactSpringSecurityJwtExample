import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getNavigationPath } from "../../utils/roleNavigation.js";
import { getFieldErrors, isFormValid } from "../../utils/validation.js";

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

  const validateForm = () => {
    const errors = getFieldErrors(formData);
    setWarnings(errors);
    return isFormValid(errors);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setWarnings((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData = await login({
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      navigate(getNavigationPath(userData.role));
    } catch (error) {
      setError?.(error);
      navigate("/error");
    }
  };

  if (user?.isLoggedIn) {
    navigate(getNavigationPath(user.role));
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
