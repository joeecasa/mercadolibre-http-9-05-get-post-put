function authMiddleware(req,res,next){
if(!req.session.userLogged){
    return res.redirect("/login2")
}else {
   next()
}
}


module.exports = authMiddleware