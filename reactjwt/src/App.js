import './App.css';
import PageLayout from "./components/PageLayout";
import React, {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import MainContainer from "./components/MainContainer";
import About from "./components/About";
import LoginForm from "./components/auth/LoginForm";
import fetcher from "./utils/fetcher";
import ErrorPage from "./components/ErrorPage";

function App() {
  const [user, setUser] = useState({})
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  let token = localStorage.getItem('token')

  useEffect(() => {
      if (token) {

        try {
          fetcher('user/me', {})
            .then(async (res) => {
                if (!res.ok) {
                  switch (res.status) {
                    case 401:
                      throw new Error("Not authorized")
                    case 403:
                      throw new Error("Forbidden")
                    case 404:
                      throw new Error("Nothing here 404");
                  }
                }
                const data = await res.json();
                let newUser = {...data, isLoggedIn: true}
                setUser(newUser)
              }
            ).catch(async (err) => {
              setError(err)
              navigate('/error')
          })

        } catch (err) {
          if (!error) {
            setError(err)
            navigate('/error')
          }
        }
      }
    }, [token]
  );

  return (
    <div>
      <Routes>
        <Route path="/" element={<PageLayout/>}>
          <Route index element={<MainContainer setError={setError}/>}/>
          <Route path='about' element={<About/>}/>
          <Route path='login' element={<LoginForm setError={setError}/>}/>
          <Route path='error' element={<ErrorPage error={error}/>}/>
        </Route>
      </Routes>

    </div>
  );
}

export default App;
