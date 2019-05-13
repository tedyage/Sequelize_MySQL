module.exports={
    host:'114.115.207.101',
    port:3306,
    username:'root',
    password:'Mxj125_MrT',
    database:"test",
    dialect:"mysql",
    benchmark:true,
    define:{
        timestamps:true,     //用于为每个模型加入createAt和updateAt时间戳字段
        paranoid:true,       //当删除某个model时，不会物理删除，而是加入deleteAt时间戳字段，其起作用的前提是timestamp为true
        underscored:false,   //用于为模型的字段加入下划线，这里不需要，故设置为false
        freezeTableName:true //用于严格设置数据表明，如果为false，数据表名会是Model名称的复数形式
    }
}