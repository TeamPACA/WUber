module.exports = function(sequelize, DataType){
    const Wine = sequelize.define("Wine",{
    winename:{
        type:DataType.STRING,
        allowNull: false,
        validate: {
            len: [3,20]
            }
        },
    variety:{
        type:DataType.STRING,
        allowNull: false,
        validate: {
            len: [3,20]
            }
        },
    year:{
        type:DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1970
            }
        },
    description:{
        type:DataType.STRING,
        allowNull: false,
        validate: {
            len: [10,100]
            }
        },
    price:{
        type:DataType.DECIMAL(10,2),
        allowNull: false,
        validate: {
            min: 5.00
            }
        }   
    
    
    });
    /*
    Wine.associate = function(models){
        Wine.belongsTo(models.Order,{
            foreignKey:{
                allowNull: false
            }
        });
    }
    */
    Wine.associate = function(models){
        Wine.belongsTo(models.Wineries,{
            foreignKey:{
                allowNull: false
            }
        });
    };
    

    return Wine
};