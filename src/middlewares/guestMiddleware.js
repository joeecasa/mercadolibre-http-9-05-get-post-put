function guestMiddleware(req,res,next){
    if(req.session.userLogged){
        return res.redirect("/profile")
    }else {
        next()
    }
    }
    
    
    module.exports = guestMiddleware