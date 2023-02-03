const getAllDogsHandler = (req, res) => {
  const { name } = req.query;
  if (name) res.send(`Quiero buscar todos los perros que se llamen ${name}`);
  else res.send("Quiero enviar todos los perros");
};
// Obtener un listado de las razas de perro
// Debe devolver solo los datos necesarios para la ruta principal(imagen,
//nombre y temperamento)

// Get BY NAME:
// ?name="..."
// Obtener un listado de las razas de perro que contengan la palabra ingresada como query parameter
// Si no existe ninguna raza de perro mostrar un mensaje adecuado

const getDogByIdHandler = (req, res) => {
  const { id } = req.params;
  res.send(`Va a enviar detalle del perro con ID ${id}`);
};
// {idRaza}:
// Obtener el detalle de una raza de perro en particular
// Debe traer solo los datos pedidos en la ruta de detalle de raza de perro
// Incluir los temperamentos asociados

const createDogHandler = (req, res) => {
  res.send("NIY: This route is gonna create a dog based in the formulary");
};
// POST /dogs:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de raza de perro por body
// Crea una raza de perro en la base de datos relacionada con sus temperamentos

module.exports = {
  getAllDogsHandler,
  getDogByIdHandler,
  createDogHandler,
};
