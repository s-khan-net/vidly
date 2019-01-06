
function log(req, res, next){
    console.log('logging requests',req.body);
    next();
}

module.exports = log;