const getTempsHandler = (req, res) => {
  res.send("NIY: This route is gonna get all the temperaments");
};
// GET /temperaments:
// Obtener todos los temperamentos posibles
// En una primera instancia deberán obtenerlos desde la API externa y guardarlos en
// su propia base de datos y luego ya utilizarlos desde allí

module.exports = { getTempsHandler };
