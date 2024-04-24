import './App.css';
import PageLayout from "./components/PageLayout";
import React from "react";
import {Route, Routes} from "react-router-dom";
import MainContainer from "./components/MainContainer";
import About from "./components/About";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<MainContainer/>}/>
          <Route path='about' element={<About/>}/>
        </Route>
      </Routes>

    </div>
  );
}

export default App;
