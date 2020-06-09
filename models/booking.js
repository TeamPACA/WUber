module.exports = function(sequelize, DataType){
    const Booking = sequelize.define("Booking",{
   
    
    
    });

    Booking.associate = function(models){
        Booking.belongsTo(models.Event,{
            foreignKey:{
                allowNull: false
            }
        });
    };
    
    Booking.associate = function(models){
        Booking.belongsTo(models.User,{
            foreignKey:{
                allowNull: false
            }
        });
    };    

    return Booking
};