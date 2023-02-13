const axios = require("axios");
const db = require("../db");
const { Sequelize } = require("sequelize");

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

// CREATING TEMPERAMENTS IN DB
const createTempsInDb = async dogList => {
  try {
    const listTemp = dogList.map(dog => dog.temperament); //retorna lista con strings con trmperamentos separadas por ','
    const filterTemps = [];

    for (const tempers of listTemp) {
      if (tempers) {
        var listAux = tempers.split(",");
      }
      for (const temp of listAux) {
        filterTemps.push(temp);
      }
    }

    filterTemps.sort();
    for (const temp of filterTemps) {
      await Temperaments.findOrCreate({ where: { name: temp.trim() } }); //hay temperamentos que se repiten por los espacion en blanco por eso el trim
    }
  } catch (error) {
    res.status.send({ error: error.message });
  }
};

//ALL TEMPERAMENTS (Clean V)
const getAllTemps = async () => {
  const temperaments = await Temperaments.findAll();
  return temperaments;
};

// // CREATE DOG IN DB
const postDogInDt = async (
  name,
  minHeight,
  maxHeight,
  minWeight,
  maxWeight,
  minLife_span,
  maxLife_span,
  temperaments
) => {
  const dog = await Dog.create({
    name,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    minLife_span,
    maxLife_span,
  }); //creating dog in DT with the data I'm gonna get

  const temperDog = await Temperaments.findAll({
    where: {
      name: {
        [Sequelize.Op.in]: temperaments,
      },
    },
  });
  dog.addTemperaments(temperDog);
};

module.exports = {
  getAllD,
  getAllTemps,
  createTempsInDb,
  postDogInDt,
};
