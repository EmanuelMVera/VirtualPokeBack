const axios = require("axios");
const { Pokemon, Types } = require("../../../db");
const { findStat } = require("../../../utils/findStat");

const getPokemons = async (req, res, next) => {
  try {
    const dbPokemons = await Pokemon.findAll({ include: Types });

    const dbPokemonsFormatted = dbPokemons.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      strength: p.strength,
      types: p.types?.map(({ name }) => name),
      created: p.created,
    }));

    let apiResults = [];
    try {
      const { data } = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=40"
      );
      apiResults = data.results;
    } catch {
      apiResults = [];
    }

    const fetchPokemonDetail = async ({ url }) => {
      try {
        const { data } = await axios.get(url);
        return {
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          strength: findStat(data.stats, "attack"),
          types: data.types?.map(({ type }) => type.name),
          created: false,
        };
      } catch {
        return null;
      }
    };

    const apiPokemons = (
      await Promise.all(apiResults.map(fetchPokemonDetail))
    ).filter(Boolean);

    res.json(dbPokemonsFormatted.concat(apiPokemons));
  } catch (error) {
    next(error);
  }
};

module.exports = { getPokemons };
