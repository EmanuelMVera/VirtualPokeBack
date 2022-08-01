// [ ] GET /pokemons/{idPokemon}:
// Obtener el detalle de un pokemon en particular
// Debe traer solo los datos pedidos en la ruta de detalle de pokemon
// Tener en cuenta que tiene que funcionar tanto para un id de un pokemon existente en pokeapi o uno creado por ustedes
const axios = require("axios");
const { Pokemon, Types } = require("../../../db.js");

const getPokemonById = async (req, res, next) => {
  const idPokemon = req.params.idPokemon;
  try {
    if (typeof idPokemon === "string" && idPokemon.length === 36) {
      const obtenerPokemonDeBD = await Pokemon.findAll({
        where: { id: idPokemon },
        include: Types,
      });
      if (obtenerPokemonDeBD != null) {
        const pokemonByDbFormated = obtenerPokemonDeBD.map((pokemon) => {
          return {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.image,
            hp: pokemon.hp,
            strength: pokemon.attack,
            defense: pokemon.defense,
            speed: pokemon.speed,
            weight: pokemon.weight,
            height: pokemon.height,
            types: pokemon.types?.map(({ name }) => name),
          };
        });
        return res.json(pokemonByDbFormated[0]);
      }
    }

    if (idPokemon.length <= 3) {
      const obtenerPokemonDeAPI = await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
        .then(({ data }) => data);
      const pokemon = {
        id: obtenerPokemonDeAPI.id,
        name: obtenerPokemonDeAPI.name,
        image: obtenerPokemonDeAPI.sprites.front_default,
        hp: obtenerPokemonDeAPI.stats[0].base_stat,
        strength: obtenerPokemonDeAPI.stats[1].base_stat,
        defense: obtenerPokemonDeAPI.stats[2].base_stat,
        speed: obtenerPokemonDeAPI.stats[5].base_stat,
        types: obtenerPokemonDeAPI.types.map((tipo) => tipo.type.name),
        weight: obtenerPokemonDeAPI.weight,
        height: obtenerPokemonDeAPI.height,
      };
      return res.json(pokemon);
    }
    res.json({ message: "Id no encontrado" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getPokemonById,
};
