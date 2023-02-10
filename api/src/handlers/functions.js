const axios = require("axios");
const db = require("../db");

// API and APIKEY
const api = "https://api.thedogapi.com/v1/breeds?api_key='";
const { API_KEY } = process.env;
const { Dog, Temperaments } = require("../db");

// DOGS FROM API

const getDogsFromApi = async () => {
  const response = await axios(`${api}${API_KEY}`);
  const dogs = response.data.map(dog => ({
    id: dog.id,
    name: dog.name,
    img: dog.image.url,
    temperament: dog.temperament,
    weight: dog.weight.imperial,
    height: dog.height.imperial,
    lifeSpan: dog.life_span,
    createdInDb: false,
  }));
  return dogs;
};

// DOGS FROM DATABASE

const getDogsFromDb = async () => {
  const dataBaseDogs = await Dog.findAll({
    include: Temperaments,
  });
  return dataBaseDogs.map(dog => {
    let newT = dog.temperaments[0].name;
    for (let i = 0; i < dog.temperaments.length; i++) {
      newT = newT + ", " + dog.temperaments[i].name;
    }
    return {
      id: dog.id,
      name: dog.name,
      img: dog.img,
      temperament: newT,
      weight: `${dog.minWeight} - ${dog.maxWeight}`,
      height: `${dog.minHeight} - ${dog.maxHeight}`,
      lifeSpan: `${dog.minLife_span} - ${dog.maxLife_span} years`,
      createdInDb: dog.createdInDb,
    };
  });
};

// API DOGS + DB DOGS = ALL DOGS
const getAllD = async () => {
  const dogsFromApi = await getDogsFromApi();
  const dogsFromDb = await getDogsFromDb();
  const allDogs = [...dogsFromApi, ...dogsFromDb];
  return allDogs;
};

// ALL TEMPERAMENTS (Repeated and Undefined included)

const getTemps = async () => {
  const getDogs = await getDogsFromApi();
  const getT = getDogs.map(dog => {
    if (!dog.temperament) {
      return dog.temperament;
    }
    const spl = dog.temperament.split(", ");
  });
  const resultantTemps = getT.flat();
  return resultantTemps;
};

// ALL TEMPS (Clean Version)
const finalTemps = async () => {
  let temps = await getTemps();
  const cleanRepeatedTemps = new Set(temps); // Delete repeated Temps
  let cleanUndefTemps = [...cleanRepeatedTemps].filter(Boolean); // Delete undef Temps
  return cleanUndefTemps;
};

module.exports = {
  getAllD,
  finalTemps,
};
