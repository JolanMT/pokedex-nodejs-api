const PkmnType = require("../models/PkmnType");

const getPokemonTypes = () => {
  return {
    data: PkmnType,
    count: PkmnType.length
  };
};

module.exports = { getPokemonTypes };
