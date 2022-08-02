const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("pokemon", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    image: {
      type: DataTypes.STRING,
    },
    hp: {
      type: DataTypes.REAL,
    },
    attack: {
      type: DataTypes.REAL,
    },
    defense: {
      type: DataTypes.REAL,
    },
    speed: {
      type: DataTypes.REAL,
    },
    height: {
      type: DataTypes.REAL,
    },
    weight: {
      type: DataTypes.REAL,
    },
    created: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
