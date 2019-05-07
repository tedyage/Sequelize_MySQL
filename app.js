const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = Sequelize(config.database,config,"Mxj125_Mrt",{
    host:'114.115.207.101',
    dialect:"mysql"
});