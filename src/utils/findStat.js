const findStat = (stats, name) =>
  stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

module.exports = { findStat };
