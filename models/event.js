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
        type:DataType.STRING,
        allowNull: false,
        },

    date:{
        type:DataType.STRING,
        allowNull: false,

        }   
    
    
    });


    Event.associate = function(models){
        Event.hasMany(models.Booking,{
            onDelete: "cascade"
        });
    };
    Event.associate = function(models){
        Event.belongsTo(models.Wineries,{
            foreignKey:{
                allowNull: false
            }
        });
    };
 
    

    return Event
};