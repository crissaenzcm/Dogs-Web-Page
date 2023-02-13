import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cards from "./components/Cards";
import CreateDog from "./components/DogCreate";
import DogDetail from "./components/DogDetail";
import LandingPage from "./components/LandingPage";
import NavBar from "./components/NavBar";
//
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      {/*  xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd */}
      <Routes>
        <Route
          exact
          path='/'
          element={<LandingPage />}
        />
        <Route
          exact
          path='/home'
          element={<Cards />}
        />
        <Route
          path='/home/:id'
          element={<DogDetail />}
        />
        <Route
          exact
          path='/dog'
          element={<CreateDog />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
