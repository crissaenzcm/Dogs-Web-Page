const axios = require("axios");
const db = require("../db");
const { Sequelize } = require("sequelize");

// API and APIKEY
const api = "https://api.thedogapi.com/v1/breeds?api_key='";
const { API_KEY } = process.env;
const { Dog, Temperaments } = require("../db");

// DOGS FROM API (Only main info)

const getDogsFromApi = async () => {
  const responseApi = await axios(`${api}${API_KEY}`);
  const dogsApi = responseApi.data.map(dog => {
    return {
      id: dog.id,
      name: dog.name,
      img: dog.image.url,
      temperament: dog.temperament,
      weight: dog.weight.imperial,
    };
  });
  return dogsApi;
};

// DOGS FROM DATABASE

const getDogsFromDb = async () => {
  let dogsDB = await Dog.findAll({
    include: {
      model: Temperaments,
      attributes: ["name"],
    },

    through: {
      attributes: [],
    },
  });

  return dogsDB;
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
  life_span,
  temperaments
) => {
  const dog = await Dog.create({
    name,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    life_span,
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
  getDogsFromApi,
  getDogsFromDb,
};
