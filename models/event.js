module.exports = function(sequelize, DataType){
    const Event = sequelize.define("Event",{
    eventname:{
        type:DataType.STRING,
        allowNull: false,
        validate: {
            len: [3,20]
            }
        },

    time:{
        type:DataType.DECIMAL(2,2),
        allowNull: false,
        },

    date:{
        type:DataType.DATEONLY,
        allowNull: false,

        }   
    
    
    });

    Event.associate = function(models){
        Event.belongsTo(models.Wineries,{
            foreignKey:{
                allowNull: false
            }
        });
    };
    

    return Event
};