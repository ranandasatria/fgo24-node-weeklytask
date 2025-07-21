const redis = require('../services/redis.service');

const clearMovieCache = async () => {
  const keys = await redis.keys('movie:*');
  const paged = await redis.keys('movies:*');
  await Promise.all([...keys, ...paged].map(key => redis.del(key)));
};

module.exports = clearMovieCache;