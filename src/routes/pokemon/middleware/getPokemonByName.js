const { Pokemon, Types } = require("../../../db.js");
const axios = require("axios");
const { Op } = require("sequelize");

const getPokemonByName = async (req, res, next) => {
  const { name } = req.query;
  try {
    let apiResult = null;
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      );
      apiResult = data;
    } catch {
      apiResult = null;
    }

    if (apiResult !== null) {
      return res.json({
        id: apiResult.id,
        name: apiResult.name,
        image: apiResult.sprites.front_default,
        types: apiResult.types.map((t) => t.type.name),
      });
    }

    const dbResult = await Pokemon.findOne({
      where: { name: { [Op.iLike]: "%" + name + "%" } },
      attributes: ["id", "name", "image"],
      include: [{ model: Types, attributes: ["name"], through: { attributes: [] } }],
    });

    if (dbResult !== null) {
      return res.json({
        id: dbResult.id,
        name: dbResult.name,
        image: dbResult.image,
        types: dbResult.types.map((type) => type.name),
      });
    }

    res.json({ name: "err" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPokemonByName };
