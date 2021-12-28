// for ensuiring that we cannont go direct to dashboard before login that's why creating this middleware to ensure that it doesn't happen



module.exports = {
ensureAuth: function(req,res,next) {
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/')
    }
},
ensureGuest: function (req, res, next){
    if(req.isAuthenticated() ){
        res.redirect('/dashboard')
    } else {
        return next()
    }
}



}

