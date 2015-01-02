module.exports = function (sequelize, DataTypes) {
    var Favorite = sequelize.define('favorite', {

        account_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        },

        movie_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        }

    }, {
        timestamps: false,

        associate: function (models) {
            Favorite.belongsTo(models.account, { foreignKey: 'account_id' });
        }
    });

    return Favorite;
};