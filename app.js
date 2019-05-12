const Sequelize = require('sequelize');

const sequelize = new Sequelize('test','root','Mxj125_MrT',{
    host:'114.115.207.101',
    dialect:'mysql'
});

console.log(sequelize);

(async()=>{
    try{
        await sequelize.authenticate();
        console.log('Connection has been establised successfully.');
    }catch(error){
        console.error("Unable to connect to the database, ",error);
    }
})();

const sequelize2 = new Sequelize({
    database:'test',
    username:'root',
    password:'Mxj125_MrT',
    host:'114.115.207.101',
    dialect:'mysql',
    benchmark:true,          //用于配置输出query日志是，输出执行时长，单位是ms
});

console.log(sequelize2);

(async()=>{
    try{
        await sequelize2.authenticate();    //用于验证数据库连接是否成功建立
        console.log('Connection has been establised successfully.');
        await sequelize2.close();           //用于关闭数据库连接
        console.log('Connections has been shutted down.');
    }catch(error){
        console.error("Unable to connect to the database, ",error);
    }
})();

const config = require('./config');
const sequelize3 = new Sequelize(config);

(async()=>{
    try{
        await sequelize3.authenticate(); 
        console.log('Connection has been establised successfully.');   
    }catch(e){
        console.error("Unable to connect to the database,",error);
    }
    sequelize3.close();
    console.log('Connection has been shuted down.');
})();