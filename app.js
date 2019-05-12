const Sequelize = require('sequelize');
const config = require('./config');

{
    /*
    建立数据库连接
    */
    //初始化Sequelize对象，就是建立数据库连接
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
        define:{
            timestamps:true,     //用于为每个模型加入createAt和updateAt时间戳字段
            paranoid:true,       //当删除某个model时，不会物理删除，而是加入deleteAt时间戳字段，其起作用的前提是timestamp为true
            underscored:false,   //用于为模型的字段加入下划线，这里不需要，故设置为false
            freezeTableName:true //用于严格设置数据表明，如果为false，数据表名会是Model名称的复数形式
        }
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
}



