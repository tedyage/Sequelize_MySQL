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

        toString(){               //定义扩展方法，利用ES6中class的语法
            return JSON.stringify(this);
        }

        static description(){     //静态方法
            return "测试用户表的创建，配置字段，配置setter和getter，配置扩展字段，配置校验等等。"
        }

        getFullName(){           //定义获取全名的扩展方法
            return this.get("firstName")+"_"+this.get("lastName");
        }
    };

    User.init({
        id:{
            type:Sequelize.INTEGER,          
            primaryKey:true,                 //字段是否是主键
            autoIncrement:true,              //字段是否自增
            comment:'主键',
            allowNull:false
        },
        userName:{
            type:Sequelize.STRING(20),
            allowNull:false,
            //unique:"index_userName",                     //字段是否唯一约束，如果是true，则代表唯一约束，该列将成为索引或索引的一部分
            comment:'用户名',
        },
        password:{
            type:Sequelize.STRING(20),
            allowNull:false,
            comment:'用户密码',
        },
        firstName:{                          //字段名称
            type:Sequelize.STRING(20),           //字段类型
            allowNull:true,                 //字段是否允许为空
            comment:'用户的姓氏',             //字段的备注信息
        },
        lastName:{
            type:Sequelize.STRING(20),
            allowNull:true,
            comment:'用户的名字',
        },
        gender:{
            type:Sequelize.STRING(10),
            allowNull:true,
            comment:'性别',
            validate:{
                isIn:{                                  //校验性别的值是否在设定数组内部的元素之中
                    args:[['male','female','unknown']], //传参args，设定数组内部元素：mail,female,unknown
                    msg:'Your gender value is not valid.'   //定义msg，自定义校验失败信息
                }
            }
        },
        age:{
            type:Sequelize.INTEGER,
            allowNull:true,
            comment:'用户的年龄',
            validate:{
                customerValidate(value){               //定制化校验，不会可空字段传空值时被跳过。
                    if(!value||(value<5||value>60))
                        throw new Error("Your age is not valid.");
                }
            }
        },
        mobile:{
            type:Sequelize.STRING(20),
            allowNull:true,                          //允许为空，则如果插入数据时，传空的话，内部校验is，会被跳过
            comment:"联系方式",
            validate:{                               //校验手机号字段是否是大陆手机号格式，提示信息使用validator.js默认提供提示
                is:/^$|((13[0-9])|(14[0-9])|(15([0-9]))|(17[0-9])|(18[0-9])|(16[0-9])|(19[0-9]))[0-9]{8}$/   
            }
        },
        email:{
            type:Sequelize.STRING(50),
            allowNull:true,
            comment:'邮箱地址',
            validate:{                              //检验电子邮箱字段的格式，是否是邮箱
                isEmail:{
                    msg:"Your email address is not valid."  //自定义msg属性来定义校验失败提示信息
                }                   
            }
        },
        province:{
            type:Sequelize.STRING(20),
            allowNull:true,
            comment:'省份',
        },
        city:{
            type:Sequelize.STRING(20),
            allowNull:true,
            comment:'城市'
        },
    },{
        sequelize,                             //数据库连接
        modelName:'user',                      //表名
        freezeTableName:true,                  //严格冻结表名，禁用复数形式
        createdAt:"createTime",                //重命名createdAt字段名为createTime，这是基于TimeStamp为true
        updatedAt:'updateTime',                //重命名updatedAt字段名为updateTime，这是基于TimeStamp为true
        indexes:[                              //表索引，建议所有的索引都同意建立在indexes数组里面
            {
                name:"user_username",          //索引名称
                type:'UNIQUE',                 //索引类型，唯一索引
                fields:[{
                    attribute:"username",      //索引对应字段,
                    length:20,                 //
                    order:"ASC",
                }],           
            }
        ],
        comment:'用户信息表',                   //用户表备注信息
        getterMethods:{                        
            fullName(){                        //定义fullName扩展字段，运用get方法来获取fullName                         
                return this.get("firstName").toUpperCase()+' '+this.get("lastName").toUpperCase();
            }
        },
        setterMethods:{                        //定义set方法，通过fullName，定义firstName和lastName
            fullName(value){
                let names = value.split(' ');
                this.setDataValue('firstName',names.slice(0,-1).join(' '));
                this.setDataValue('lastName',names.slice(-1).join(' '));
            }
        },
        validate:{                             //model-validate，校验的不是某个field，而是model的内部多个数据逻辑
            //这个是在校验省和市两个字段，是否都有值，或者是否都为空？，如果其中一个有值，而另一个为空，则校验失败。
            //类似这样的校验，推荐写在model-validate中，不推荐写在field-validate中。
            provinceAndCity(){
                if(!this.province!==!this.city){
                    throw new Error('Require either both Province and city or neither of them');
                }
            }
        }
    });

    (async()=>{
        try{
            /*
            同步模型到数据库方法Model.sync()
            */
            await User.sync({force:true});  //force:true，代表删除原来的表，重新建立此表。
            //插入一条数据
            let user = {
                userName:'tedyage',
                password:'123',
                fullName:'tian zhiqiang',
                gender:'male',
                age:30,
                mobile:'18515295518',
                email:'tedyage@sina.com',
                province:'BeiJing',
                city:'BeiJing'
            }
            //fullName，可以通过init方法中的options里面的setterMethods属性中的fullname方法获取firstName/lastName
            await User.create(user);  
            //查询一条数据
            user = await User.findOne();
            console.log(user.toString());               //输出user的JSON字符串
            console.log(user.getFullName());            //获取user的全名
            console.log(User.description());            //输出User的描述信息
            console.log(user.get("fullName"));          //TIAN ZHIQIANG,利用getterMethods属性中的fullname方法
            console.log(user.createTime);               //格林威治时间转化为当前时区的时间
        }catch(e){
            console.error(e);
        }
        sequelize.close(); 
    })();
}

{
    // //第二种，利用sequelize.define(tablename,attributes,options)
    // sequelize.define('user_role',{
    //     id:{
    //         type:Sequelize.INTEGER,          
    //         primaryKey:true,                 //字段是否是主键
    //         autoIncrement:true,              //字段是否自增
    //         comment:'主键',
    //         allowNull:false
    //     },
    //     user_id:{
    //         type:Sequelize.INTEGER,
    //         references:{
    //             model:'User',
    //             key:"id",
    //         },
    //         allowNull:true,
    //         onDelete:"SET NULL",
    //     },
    //     role:{
    //         type:Sequelize.STRING,
    //         allowNull:true
    //     }
    // },{
    //     freezeTableName:true,
    //     comment:'用户信息表',
    // });
    // //在sequelize.define()内部，其实也是调用的Sequelize.Model.init()

    // {
    //     sequelize.sync()
    //     .then(()=>console.log("数据库同步成功"))
    //     .catch(error=>console.error("数据库同步失败，",error));

    //     //在生产环境，数据库同步不再适用，要使用数据库迁移Migration
    // }
}