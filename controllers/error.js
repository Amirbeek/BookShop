exports.NotExistPage =(req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found',path:'/404', activeShop: false,   // Since 404 is not part of Shop, set to false
        activeAdmin: false
    });
}