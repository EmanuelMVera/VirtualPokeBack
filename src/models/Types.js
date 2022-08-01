const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Types extends Model {}

  Types.init(
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "types",
    }
  );

  return Types;
};
