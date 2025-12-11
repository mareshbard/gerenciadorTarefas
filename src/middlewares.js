exports.checkLogin =(req, res, next) => {
    if(req.session.user){
        next();
    } else{
        res.redirect("/login")
    }
}

exports.checkLogged = (req, res, next) => {
    if(!req.session.user){
        next();
    } else{
        res.redirect("/totalWorkspaces");
    }
}
