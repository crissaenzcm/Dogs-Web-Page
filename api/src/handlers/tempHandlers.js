//Require functions
const { getAllD, getAllTemps } = require("./functions");

// Require DB Models
//const { Dog, Temperaments } = require("../db");

// GET /temperaments:
// Obtener todos los temperamentos posibles
// En una primera instancia deberán obtenerlos desde la API externa y guardarlos en
// su propia base de datos y luego ya utilizarlos desde allí
const getTempsHandler = async (req, res) => {
  try {
    const temperaments = await getAllTemps();

    if (temperaments.length === 1) {
      res.status(405).send({
        error: "There is no temperaments in the data base",
      });
    } else {
      res.status(201).send(temperaments);
    }
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};
module.exports = { getTempsHandler };
