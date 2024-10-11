exports.getLogin =  (req,res,next)=>{
    res.render('auth/login',{
        path:'/order',
        pageTitle: 'Login',
        isAuth: req.isLoginIn
    })
}

exports.postLogin  =  (req,res,next)=>{
    res.setHeader('Set-Cookie', 'loggedIn=true')
    res.redirect('/')
}