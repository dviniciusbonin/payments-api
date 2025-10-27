export default () => {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    database: {
      url: process.env.DATABASE_URL,
    },
  };
};
