const axios = require("axios");
const { Pokemon, Types } = require("../../../db.js");
const { pokemonSchema } = require("../../../validators/pokemonSchema");

const DEFAULT_IMAGE =
  "https://w7.pngwing.com/pngs/248/960/png-transparent-pikachu-pokemon-go-silhouette-drawing-pikachu-dog-like-mammal-fictional-character-black.png";

const createdPokemon = async (req, res, next) => {
  try {
    const result = pokemonSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    const pokemon = result.data;

    const nameInDb = await Pokemon.findOne({ where: { name: pokemon.name } });
    if (nameInDb) {
      return res.status(400).json({ error: "Name already exists" });
    }

    let nameInApi = null;
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
      );
      nameInApi = data;
    } catch {
      nameInApi = null;
    }
    if (nameInApi !== null) {
      return res.status(400).json({ error: "Name already exists in PokéAPI" });
    }

    const newPokemon = await Pokemon.create({
      name: pokemon.name,
      image: pokemon.image || DEFAULT_IMAGE,
      hp: pokemon.hp,
      strength: pokemon.strength,
      defense: pokemon.defense,
      speed: pokemon.speed,
      height: pokemon.height,
      weight: pokemon.weight,
      created: true,
    });

    const typeIds = pokemon.typesId.length ? pokemon.typesId : [19];
    const types = await Types.findAll({ where: { id: typeIds } });
    await Promise.all(types.map((type) => type.addPokemon(newPokemon.id)));

    res.status(201).json(newPokemon);
  } catch (err) {
    next(err);
  }
};

module.exports = { createdPokemon };
