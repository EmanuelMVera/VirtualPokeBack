require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
// const { DATABASE_URL } = process.env;
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

// const sequelize = new Sequelize(DATABASE_URL, {
//   logging: false,
//   native: false,
//   dialectOptions: {
//     ssl:
//       process.env.NODE_ENV === 'production'
//         ? { require: true, rejectUnauthorized: false }
//         : false,
//   },
// });

// Instancia de Sequelize según entorno
export const sequelize = new Sequelize({
  logging: false,
  native: false,
  dialect: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT || '5432', 10),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false,
  native: false,
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === 'production'
        ? { require: true, rejectUnauthorized: false }
        : false,
  },
});

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Pokemon, Types } = sequelize.models;

Pokemon.belongsToMany(Types, { through: 'pokemontypes' });
Types.belongsToMany(Pokemon, { through: 'pokemontypes' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
