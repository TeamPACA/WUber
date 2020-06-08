module.exports = function(sequelize, DataType){
    const Wineries = sequelize.define("Wineries", {
        wineryname: {
            type: DataType.STRING,
            allowNull: false
        },
        wineaddress: {
            type: DataType.STRING,
            allowNull: false,
        },
        winepostcode: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                len: (4)
            }
        },
        winephone: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
            }
        },
        wineemail: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        FK_Userid:{
            type: DataType.STRING,
        }

    });
    // Wineries.associate = function(models){
    //     Wineries.belongsTo(models.User, {
    //         foreginKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    Wineries.associate = function(models){
        Wineries.hasMany(models.Event,{
            onDelete: "cascade"
        });
    };
    Wineries.associate = function(models){
        Wineries.hasMany(models.Wine,{
            onDelete: "cascade"
        });
    };



    return Wineries;
}