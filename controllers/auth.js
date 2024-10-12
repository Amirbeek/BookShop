exports.getLogin =  (req,res,next)=>{
    // const isLoggedIn = req.get('Cookie')
    //         .split(';')[1]
    //         .trim()
    //         .split('=')[1] === 'true'

    console.log(req.session.isLoggedIn)
    res.render('auth/login',{
        path:'/order',
        pageTitle: 'Login',
        isAuth: false
    })
}

exports.postLogin  =  (req,res,next)=>{
    // res.setHeader('Set-Cookie', 'loggedIn=true;')
    req.session.isLoggedIn = true
    /* we can also use Expires, Max-age=10, Secure
     HttpOnly you will not directly set your cookies because you rather use packages */
    res.redirect('/login')
}