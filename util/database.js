const Sequelize = require('sequelize')

const sequelize = new Sequelize('new_schema','root','335710016',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize