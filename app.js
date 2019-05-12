const Sequelize = require('sequelize');
const config = require('./config');

// {
//     /*
//     建立数据库连接
//     */
//     //初始化Sequelize对象，就是建立数据库连接
//     const sequelize = new Sequelize('test','root','Mxj125_MrT',{
//         host:'114.115.207.101',
//         dialect:'mysql'
//     });
    
//     console.log(sequelize);
    
//     (async()=>{
//         try{
//             await sequelize.authenticate();
//             console.log('Connection has been establised successfully.');
//         }catch(error){
//             console.error("Unable to connect to the database, ",error);
//         }
//     })();
    
//     const sequelize2 = new Sequelize({
//         database:'test',
//         username:'root',
//         password:'Mxj125_MrT',
//         host:'114.115.207.101',
//         dialect:'mysql',
//         benchmark:true,          //用于配置输出query日志是，输出执行时长，单位是ms
//         define:{
//             timestamps:true,     //用于为每个模型加入createAt和updateAt时间戳字段
//             paranoid:true,       //当删除某个model时，不会物理删除，而是加入deleteAt时间戳字段，其起作用的前提是timestamp为true
//             underscored:false,   //用于为模型的字段加入下划线，这里不需要，故设置为false
//             freezeTableName:true //用于严格设置数据表明，如果为false，数据表名会是Model名称的复数形式
//         }
//     });
    
//     console.log(sequelize2);
    
//     (async()=>{
//         try{
//             await sequelize2.authenticate();    //用于验证数据库连接是否成功建立
//             console.log('Connection has been establised successfully.');
//             await sequelize2.close();           //用于关闭数据库连接
//             console.log('Connections has been shutted down.');
//         }catch(error){
//             console.error("Unable to connect to the database, ",error);
//         }
//     })();
    

//     const sequelize3 = new Sequelize(config);
    
//     (async()=>{
//         try{
//             await sequelize3.authenticate(); 
//             console.log('Connection has been establised successfully.');   
//         }catch(e){
//             console.error("Unable to connect to the database,",error);
//         }
//         sequelize3.close();
//         console.log('Connection has been shuted down.');
//     })();
// }

{
    //建立数据库表模型
    /*
    数据库表模型，都是继承了Sequelize.Model这个类。
    模型定义有两种等同的方法
    */

    const sequelize = new Sequelize(config);
    // {
    //     //第一种，利用Sequelize.Model.init(attribues,options)
    //     const Model = Sequelize.Model;
    //     //定义User模型
    //     class User extends Model{

    //     };

    //     User.init({
    //         id:{
    //             type:Sequelize.INTEGER,          
    //             primaryKey:true,                 //字段是否是主键
    //             autoIncrement:true,              //字段是否自增
    //             comment:'主键',
    //             allowNull:false
    //         },
    //         firstName:{                          //字段名称
    //             type:Sequelize.STRING,           //字段类型
    //             allowNull:false,                 //字段是否允许为空
    //             defaultValue:'Unknown',          //字段默认值
    //             unique:true,                     //字段是否有唯一约束
    //             comment:'用户的姓氏',             //字段的备注信息
    //         },
    //         lastName:{
    //             type:Sequelize.STRING,
    //         }
    //     },{
    //         sequelize,                             //数据库连接
    //         modelName:'user',                      //表名
    //         freezeTableName:true,                  //严格冻结表名，禁用复数形式
    //         indexes:[                              //表索引
    //             {
    //                 name:'index_firstName',         //表索引名称
    //                 type:'UNIQUE',                  //索引类型，唯一索引
    //                 fields:["firstName"],           //索引对应字段
    //             }
    //         ],
    //         comment:'用户信息表'                      //用户表备注信息
    //     });

    //     {
    //         /*
    //         同步模型到数据库方法Model.sync()
    //         */

    //         User.sync({force:true})                   //force:true，代表删除原来的表，重新建立此表。
    //         .then(()=>console.log('user表同步成功'))
    //         .catch(error=>console.error('user表同步失败，',error));
    //     }

    // }
    
    {
        //第二种，利用sequelize.define(tablename,attributes,options)
        sequelize.define('user_role',{
            id:{
                type:Sequelize.INTEGER,          
                primaryKey:true,                 //字段是否是主键
                autoIncrement:true,              //字段是否自增
                comment:'主键',
                allowNull:false
            },
            user_id:{
                type:Sequelize.INTEGER,
                references:{
                    model:'User',
                    key:"id",
                },
                allowNull:true,
                onDelete:"SET NULL",
            },
            role:{
                type:Sequelize.STRING,
                allowNull:true
            }
        },{
            freezeTableName:true,
            comment:'用户信息表',
        });
        //在sequelize.define()内部，其实也是调用的Sequelize.Model.init()

        {
            sequelize.sync()
            .then(()=>console.log("数据库同步成功"))
            .catch(error=>console.error("数据库同步失败，",error));

            //在生产环境，数据库同步不再适用，要使用数据库迁移Migration
        }
    }
}
