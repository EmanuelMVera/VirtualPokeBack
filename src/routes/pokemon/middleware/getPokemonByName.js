// [ ] GET /pokemons?name="...":
// Obtener el pokemon que coincida exactamente con el nombre pasado como query parameter (Puede ser de pokeapi o creado por nosotros)
// Si no existe ningún pokemon mostrar un mensaje adecuado
const { Pokemon, Types } = require("../../../db.js");
const axios = require("axios");
const { Op } = require("sequelize");

const getPokemonByName = async (req, res, next) => {
  const { name } = req.query;
  try {
    //Buscar en la API
    const buscarPokemonAPI = await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .then(({ data }) => data)
      .catch(() => null);

    if (buscarPokemonAPI != null) {
      const pokemones = {
        id: buscarPokemonAPI.id,
        name: buscarPokemonAPI.name,
        image: buscarPokemonAPI.sprites.front_default,
        types: buscarPokemonAPI.types.map((tipo) => tipo.type.name),
      };
      return res.json(pokemones);
    }

    //Buscar en la Base de Datos
    const pokemonDB = await Pokemon.findOne({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: "%" + name } }],
      },
      include: Types,
    });
    if (pokemonDB !== null) return res.json(pokemonDB);

    //Respuesta si no se encuentra al pokemon
    res.json({ name: "err" });
  } catch (err) {
    console.log("Error: " + err.name);
    console.log("message: " + err.message);
    next(err);
  }
};

module.exports = {
  getPokemonByName,
};
