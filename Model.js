const Sequelize = require('sequelize');
const config = require('./config');
    /*
    建立数据库表模型
    数据库表模型，都是继承了Sequelize.Model这个类。
    模型定义有两种等同的方法
    */

   const sequelize = new Sequelize(config);
   {
       //第一种，利用Sequelize.Model.init(attribues,options)
       const Model = Sequelize.Model;
       //定义User模型
       class User extends Model{

       };

       User.init({
           id:{
               type:Sequelize.INTEGER,          
               primaryKey:true,                 //字段是否是主键
               autoIncrement:true,              //字段是否自增
               comment:'主键',
               allowNull:false
           },
           firstName:{                          //字段名称
               type:Sequelize.STRING,           //字段类型
               allowNull:false,                 //字段是否允许为空
               defaultValue:'Unknown',          //字段默认值
               unique:true,                     //字段是否有唯一约束
               comment:'用户的姓氏',             //字段的备注信息
           },
           lastName:{
               type:Sequelize.STRING,
           }
       },{
           sequelize,                             //数据库连接
           modelName:'user',                      //表名
           freezeTableName:true,                  //严格冻结表名，禁用复数形式
           indexes:[                              //表索引
               {
                   name:'index_firstName',         //表索引名称
                   type:'UNIQUE',                  //索引类型，唯一索引
                   fields:["firstName"],           //索引对应字段
               }
           ],
           comment:'用户信息表'                      //用户表备注信息
       });

       {
           /*
           同步模型到数据库方法Model.sync()
           */

           User.sync({force:true})                   //force:true，代表删除原来的表，重新建立此表。
           .then(()=>console.log('user表同步成功'))
           .catch(error=>console.error('user表同步失败，',error));
       }

   }
   
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