// [ ] GET /pokemons:
// Obtener un listado de los pokemons desde pokeapi.
// Debe devolver solo los datos necesarios para la ruta principal
const axios = require("axios");
const { Pokemon, Types } = require("../../../db");

const getPokemons = async (req, res, next) => {
  try {
    const obtenerPokemonesDeBD = await Pokemon.findAll({
      include: Types,
    });

    const getPokeDataDb = obtenerPokemonesDeBD.map((response) => {
      return {
        id: response.id,
        name: response.name,
        image: response.image,
        strength: response.strength,
        types: response.types?.map(({ name }) => name),
        created: response.created,
      };
    });

    const pokemonesDeAPI = await axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=40`)
      .then(({ data }) => data.results)
      .catch((err) => []);

    const getPokeData = async ({ url }) =>
      await axios
        .get(url)
        .then(({ data }) => ({
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          strength: data.stats[1].base_stat,
          types: data.types?.map(({ type }) => type.name),
          created: false,
        }))
        .then((poke) => {
          //   throw new Error(`error ${poke.id}`);
          return poke;
        });

    const pokemonesDeAPIDetallados = await Promise.all(
      pokemonesDeAPI?.map(getPokeData)
    ).catch((err) => []);

    res.json(getPokeDataDb.concat(pokemonesDeAPIDetallados));
  } catch (error) {
    // console.log("Error: " + error.name);
    // console.log("message: " + error.message);
    next(error);
  }
};

module.exports = {
  getPokemons,
};
