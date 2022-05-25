const User = require ("../../models/User") // traigo para poder buscar el usuario para usarlo para autologuearse

const userLoggedMiddleware = function (req, res, next) {
    res.locals.isLogged = false
    let emailInCookie = req.cookies.userEmail;
    let userFromCookie = User.findByField("email",emailInCookie)
    
     if(userFromCookie){ //// si tengo un usuario en la cookie entonces lo paso a req.session
         req.session.userLogged = userFromCookie 

     }
    if (req.session.userLogged) {
         res.locals.isLogged = true
         res.locals.userLogged = req.session.userLogged
         // para poder usar la session dentro de una vista lo tenemos q pasar como parametro del render
         // como aca no estamos pasando nada la pasamos a una variable local que se puede utilizar de manera global
         
     }
     
     
            

     next()

}
module.exports = userLoggedMiddleware