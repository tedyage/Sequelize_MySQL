const Sequelize = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config);

{

    // (async()=>{
    //     try{
    //         let users = await User.create({
    //             firstName:'Tian',
    //             lastName:'Zhiqiang'
    //         })
    //         console.log(users);
    //     }catch(e){
    //         console.error('插入用户数据失败，',e);
    //     }
        
    // })();
}