var notFound = function(message){
  var err = new Error(message);
  err.status = 404;
  return err;
}

module.exports = { notFound : notFound };