//Require functions
const {
  getAllD,
  getAllTemps,
  createTempsInDb,
  postDogInDt,
} = require("./functions");
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
    createTempsInDb(dogs);

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

// POST /dogs:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de raza de perro por body
// Crea una raza de perro en la base de datos relacionada con sus temperamentos
const createDogHandler = async (req, res) => {
  const {
    name,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    life_span,
    temperaments,
  } = req.body;

  const expRegName = /^([a-zA-Z]+)(\s[a-zA-Z]+)*$/; // expresion regular para que solo se pueda recibir letras
  const expRegPosNum = /^[1-9]/; //Solo acepta numeros positivos

  let flag = expRegName.test(name);

  if (flag === false)
    res.status(403).send({
      error:
        "The name of the dog does not accept special characters or numbers",
    });
  else if (
    !name ||
    !minHeight ||
    !maxHeight ||
    !minWeight ||
    !maxWeight ||
    !life_span ||
    !temperaments
  ) {
    // verifico que no falte ningun  dato
    //falta algun dato
    res
      .status(405)
      .json({ error: "Please fill all the options to create your dog" });
  } else {
    // si no falta ningun dato

    const flagminHei = expRegPosNum.test(minHeight);
    const flagmaxHei = expRegPosNum.test(maxHeight); //verifico que la altura no sea un numero negativo

    const flagminWei = expRegPosNum.test(minWeight);
    const flagmaxWei = expRegPosNum.test(maxWeight); //verifico que el peso no sea un numero negativo

    const flagLifSpa = expRegPosNum.test(life_span); //verifico que lifeSpan no sea un numero negativo
    const lifeSpToNum = Number(life_span); // paso life span a numero para verificar el rango y que sea numero

    const flagName = await Dog.findOne({ where: { name: name } }); //verifico que el nombre no se repita en la base de datos

    if (minHeight > maxHeight) {
      res.status(405).send({
        error: "The minHeight can not be the higher than the maxHeight",
      });
    } else if (minWeight > maxWeight) {
      res
        .status(405)
        .send({
          error: "The minWeight can not be the higher than the maxWeight",
        });
    } else if (!flagLifSpa || lifeSpToNum === NaN || lifeSpToNum > 22) {
      res.status(405).send({
        error: "life span must be a number between 1 and 22",
      });
    } else if (!flagminHei || !flagmaxHei) {
      res
        .status(405)
        .send({ error: "The Height can not be a negative number" });
    } else if (!flagminWei || !flagmaxWei) {
      res
        .status(405)
        .send({ error: "The Weight can not be a negative number" });
    } else if (flagName) {
      // si el nombre existe no lo creo
      res.status(405).send({
        error: `There is already a dog with name ${name} in the Data Base`,
      });
      console.log(flagName);
    } else {
      try {
        await postDogInDt(
          name,
          minHeight,
          maxHeight,
          minWeight,
          maxWeight,
          life_span,
          temperaments
        ); // si esta todo ok creo el perro
        res
          .status(202)
          .json({ msj: `The dog ${name} was succesfully created` });
      } catch (error) {
        res.status(405).send({ error: error.message });
      }
    }
  }
};

module.exports = {
  getAllDogsHandler,
  getDogByIdHandler,
  createDogHandler,
};
