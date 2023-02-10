//Require functions
const { getAllD, finalTemps } = require("./functions");
// Require DB Models
const { Dog, Temperaments } = require("../db");

// Obtener un listado de las razas de perro
// Debe devolver solo los datos necesarios para la ruta principal(imagen,
//nombre y temperamento)

// Get BY NAME:
// ?name="..."
// Obtener un listado de las razas de perro que contengan la palabra ingresada como query parameter
// Si no existe ninguna raza de perro mostrar un mensaje adecuado
const getAllDogsHandler = async (req, res) => {
  try {
    const { name } = req.query;
    const dogs = await getAllD();
    const data = dogs.map(dog => dog);
    //If I'm looking for a name
    if (name) {
      let dogFound = data.find(
        dog => name.toLowerCase() === dog.name.toLowerCase()
      );
      dogFound
        ? res.status(201).send(dogFound)
        : res.status(420).send({
            error: `The dog ${name} does not exist`,
          });
      // I call all the dogs
    } else {
      return res.json(data);
    }
  } catch (error) {
    res.status(402).send({ error: error.message });
  }
};

// {idRaza}:
// Obtener el detalle de una raza de perro en particular
// Debe traer solo los datos pedidos en la ruta de detalle de raza de perro
// Incluir los temperamentos asociados
const getDogByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const dogs = await getAllD();
    let filtDog = dogs.find(dog => dog.id == id);
    filtDog
      ? res.status(200).send(filtDog)
      : res.status(420).send({ error: `There is not dog with the id ${id}` });
  } catch (error) {
    res.status(402).send({ error: error.message });
  }
};

const createDogHandler = (req, res) => {
  const { name, height, weight, life_span } = req.body;
  res.send(`Voy a crear un perro con:
  name: ${name},
  height: ${height} feets,
  weight: ${weight} pounds,
  life_span: ${life_span} years,
  `);
};
// POST /dogs:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de raza de perro por body
// Crea una raza de perro en la base de datos relacionada con sus temperamentos

module.exports = {
  getAllDogsHandler,
  getDogByIdHandler,
  createDogHandler,
};
