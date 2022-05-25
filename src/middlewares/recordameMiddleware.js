function recordameMiddleware( req, res, next){
    next();
    
    if(req.cookies.recordame != undefined && 
       req.session.usuarioLogueado == undefined){
        let users = []
        let UsersJSON = fs.readFileSync(usersFilePath, 'utf-8')
        if (UsersJSON == "") {
            users = []
        }
        else {
            users = JSON.parse(UsersJSON) //de JSON a JS
            
        }
        // users.forEach(hola=>{
        // 	console.log(hola.Contraseña)
        // })
         //let usuarioALoguearse
        for(let i = 0; i< users.length; i++){
            if(users[i].Email == req.cookies.recordame){
                usuarioALoguearse = users[i]
            // 	if(bcrypt.compareSync(req.body.password, users[i].Contraseña)){
            // 		 usuarioALoguearse = users[i]
            		break;
            // 	}
             } else{
                usuarioALoguearse = undefined
            } 
        }
        req.session.usuarioLogueado = usuarioALoguearse
    }
}
    
    module.exports = recordameMiddleware