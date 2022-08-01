const express = require("express");
const { createdPokemon } = require("./middleware/createdPokemon.js");
const { getPokemons } = require("./middleware/getPokemons.js");
const { getPokemonByName } = require("./middleware/getPokemonByName.js");
const { getPokemonById } = require("./middleware/getPokemonById.js");

const router = express.Router();

const getPokemonsRoute = (req, res, next) =>
  req.query.name
    ? getPokemonByName(req, res, next)
    : getPokemons(req, res, next);

router.post("/pokemons", createdPokemon);
router.get("/pokemons", getPokemonsRoute);
router.get("/pokemons/:idPokemon", getPokemonById);

module.exports = router;
