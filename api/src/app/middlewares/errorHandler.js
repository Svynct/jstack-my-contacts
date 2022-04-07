module.exports = (error, request, response, next) => {
  console.log('❌ Error -', error);
  response.sendStatus(500);
};
