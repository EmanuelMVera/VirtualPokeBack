const axios = require("axios");
const { Pokemon, Types } = require("../../../db.js");
const { findStat } = require("../../../utils/findStat");

const getPokemonById = async (req, res, next) => {
  const { idPokemon } = req.params;
  try {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idPokemon
      );

    if (isUUID) {
      const dbPokemon = await Pokemon.findOne({
        where: { id: idPokemon },
        include: Types,
      });
      if (!dbPokemon) return res.status(404).json({ error: "Pokemon not found" });
      return res.json({
        id: dbPokemon.id,
        name: dbPokemon.name,
        image: dbPokemon.image,
        hp: dbPokemon.hp,
        strength: dbPokemon.strength,
        defense: dbPokemon.defense,
        speed: dbPokemon.speed,
        weight: dbPokemon.weight,
        height: dbPokemon.height,
        types: dbPokemon.types?.map(({ name }) => name),
      });
    }

    if (Number.isInteger(Number(idPokemon))) {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${idPokemon}`
      );
      return res.json({
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        hp: findStat(data.stats, "hp"),
        strength: findStat(data.stats, "attack"),
        defense: findStat(data.stats, "defense"),
        speed: findStat(data.stats, "speed"),
        types: data.types.map((t) => t.type.name),
        weight: data.weight,
        height: data.height,
      });
    }

    res.status(404).json({ error: "Invalid Pokemon ID" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPokemonById };
