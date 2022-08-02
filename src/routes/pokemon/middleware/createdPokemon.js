// [ ] POST /pokemons:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
// Crea un pokemon en la base de datos relacionado con sus tipos.
const axios = require("axios");
const { Pokemon, Types } = require("../../../db.js");

const createdPokemon = async (req, res, next) => {
  try {
    const pokemon = req.body;
    const objPokemon = {
      name: pokemon.name,
      image:
        pokemon.image ||
        "https://w7.pngwing.com/pngs/248/960/png-transparent-pikachu-pokemon-go-silhouette-drawing-pikachu-dog-like-mammal-fictional-character-black.png",
      hp: pokemon.hp || 0,
      attack: pokemon.attack || 0,
      defense: pokemon.defense || 0,
      speed: pokemon.speed || 0,
      height: pokemon.height || 0,
      weight: pokemon.weight || 0,
      created: true,
    };

    //Validation
    if (!pokemon.name) res.status(400).json({ error: "missing values" });

    const nameInDb = await Pokemon.findAll({
      where: { name: pokemon.name },
    });
    const nameInApi = await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${JSON.stringify(pokemon.name)}`)
      .then(({ data }) => data)
      .catch((err) => []);
    if (nameInDb.length > 0 || nameInApi.length > 0)
      return res.status(400).json({ error: "Name already exists" });
    //Validation end

    const createdPokemon = await Pokemon.create(objPokemon);
    let ids;
    !pokemon.typesId.length ? (ids = [19]) : (ids = pokemon.typesId);
    const types = await Types.findAll({
      where: { id: ids },
    });
    if (types) {
      types.forEach((type) => {
        type.addPokemon(createdPokemon.id);
      });
    }
    res.status(201).json(createdPokemon);
  } catch (err) {
    res.sendStatus(500);
    next(err);
  }
};

module.exports = {
  createdPokemon,
};
