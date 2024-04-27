import React, {useEffect, useState} from "react";
import fetcher from "../utils/fetcher";

function MainContainer() {
  const [user, setUser] = useState({})
  const [error, setError] = useState(null)
  let token = localStorage.getItem('token')

  useEffect(() => {
      if (token) {

        try {
          fetcher('http://localhost:8080/user/me', {})
            .then(async (res) => {
                const data = await res.json();
                let newUser = {...data, isLoggedIn: true}
                setUser(newUser)
              }
            ).catch(async (err) => {
              setError(err)
          })

        } catch
          (err) {
          setError(err)
        }
      }
    }
    ,
    [token]
  )
  ;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="maincontainer">
      <h1>Example de Spring security avec JWT</h1>
      <p>Dans cet exemple, vous trouverez le nécessaire pour implanter la sécurité avec des tokens JWT</p>
    </div>
  )
}

export default MainContainer;