// [ ] GET /types:
// Obtener todos los tipos de pokemons posibles
// En una primera instancia deberán traerlos desde pokeapi y guardarlos en su propia base de datos y luego ya utilizarlos desde allí
const { Types } = require("../../../db.js");

const getTypes = async (req, res, next) => {
  try {
    const getTypesByDb = await Types.findAll({
      attributes: ["name", "id"],
      through: { attributes: [] },
    });

    !getTypesByDb.length
      ? res.json({ message: "Tipos aun no cargados" })
      : res.json(getTypesByDb);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTypes,
};
