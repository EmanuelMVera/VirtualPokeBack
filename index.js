const server = require("./src/app.js");
const { conn, Types } = require("./src/db.js");
const axios = require("axios");
const { PORT } = process.env;

// Syncing all the models at once.
conn.sync({ force: false }).then(async () => {
  //Precarga de tipos
  const types = await axios.get(`https://pokeapi.co/api/v2/type`);

  const typesData = types.data.results?.map((type) => {
    return {
      name: type.name,
    };
  });
  await Types.bulkCreate(typesData);

  server.listen(PORT, () => console.log(`Listen on port ${PORT}`));
});
