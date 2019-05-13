const Sequelize = require('Sequelize');
const config = require("./config");

const sequelize = new Sequelize(config);

class Project extends Sequelize.Model{
    toString(){
        if(!this)
            return "";
        return JSON.stringify(this);
    }
}

Project.init({
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        comment:"主键"
    },
    name:{
        type:Sequelize.STRING(100),
        allowNull:false,
        validate:{
            notNull:{
                msg:"The name cannot be null."
            },
            notEmpty:{
                msg:"The name cannot be empty."
            }
        }
    }
},{
    sequelize,
    modelName:"project",
    createdAt:"createTime",
    updatedAt:"updateTime",
});

class User_Test extends Sequelize.Model{
    toString(){
        if(!this)
            return "";
        return JSON.stringify(this);
    }
}

User_Test.init({
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
        comment:'用户名',
    },
    password:{
        type:Sequelize.STRING(20),
        allowNull:false,
        comment:'用户密码',
    },   
},{
    sequelize,                             //数据库连接
    modelName:'user_test',                 //表名
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
    comment:'用户信息测试表',                   //用户表备注信息    
});



(async()=>{
    try{
        /*
        DROP TABLE IF EXISTS `project`
        CREATE TABLE IF NOT EXISTS `project` 
        (`id` INTEGER NOT NULL auto_increment  COMMENT '主键', 
         `name` VARCHAR(100) NOT NULL, 
         `createTime` DATETIME NOT NULL, 
         `updateTime` DATETIME NOT NULL, 
         `deletedAt` DATETIME, 
         PRIMARY KEY (`id`)) ENGINE=InnoDB
        */
        await sequelize.sync({force:true});
        console.log("Complete sync model.");
        let project = {
            name:"Project01"
        }
        /*
        INSERT INTO `project` (`id`,`name`,`createTime`,`updateTime`) 
        VALUES (DEFAULT,?,?,?)
        */
        await Project.create(project);
        console.log("Insert a data successfully.");
        //project will be the first entry matches with the primary key '1'||null
        /*
        SELECT `id`, `name`, `createTime`, `updateTime`, `deletedAt` 
        FROM `project` AS `project` 
        WHERE (`project`.`deletedAt` IS NULL AND `project`.`id` = 1)
        */
        project = await Project.findByPk(1);
        console.log("findByPk data with primary key 1 successfully.");
        console.log(project.toString());
        //project will be the first entry matches with the name 'Project02'||null
        /*
        SELECT `id`, `name`, `createTime`, `updateTime`, `deletedAt` 
        FROM `project` AS `project` 
        WHERE (`project`.`deletedAt` IS NULL AND `project`.`name` = 'Project01') LIMIT 1;
        */
        project = await Project.findOne({where:{
            name:'Project01'
        }});
        console.log("findOne data with filter successfully.");
        /*
        SELECT `id`, `name` AS `title` 
        FROM `project` AS `project` 
        WHERE (`project`.`deletedAt` IS NULL AND `project`.`name` = 'Project01') LIMIT 1
        */
        project = await Project.findOne({
            where:{
                name:'Project01'
            },
            attributes:['id',['name','title']]           //查询结果字段name，用别名title替代
        });

        /*
        SELECT count(*) AS `count` 
        FROM `project` AS `project` 
        WHERE (`project`.`deletedAt` IS NULL);
        SELECT `id`, `name`, `createTime`, `updateTime`, `deletedAt` 
        FROM `project` AS `project` 
        WHERE (`project`.`deletedAt` IS NULL) LIMIT 5, 10
        */
        let res = await Project.findAndCountAll({        //同时返回满足where条件的数据集总条数，和所满足offset和limit的的
            where:null,
            offset:5,
            limit:10
        });
        console.log(res.count);      //total count is 1
        console.log(res.rows);       //rows is empty.
        
        /*
        START TRANSACTION 
        SELECT `id`, `userName`, `password`, `createTime`, `updateTime`, `deletedAt` 
        FROM `user_test` AS `user_test` 
        WHERE (`user_test`.`deletedAt` IS NULL AND `user_test`.`userName` = 'tedyage') LIMIT 1;
        INSERT INTO `user_test` (`id`,`userName`,`password`,`createTime`,`updateTime`) 
        VALUES (DEFAULT,?,?,?,?);
        COMMIT;
        */
        [user_test,created] = await User_Test.findOrCreate({       //先根据where条件查询对应entry是否存在，如果存在则直接返回对应结果，否则插入该数据并返回插入结果
            where:{
                userName:"tedyage"
            },defaults:{
                password:"1234"
            }
        });
        console.log(created);                                      //true，代表数据是新添加的。
        console.log(user_test.toString());                         //数据结果

    }
    catch(e){
        console.error(e.message||e);
    }
    sequelize.close();
})();