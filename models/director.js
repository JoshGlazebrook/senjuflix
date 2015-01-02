module.exports = function (sequelize, DataTypes) {
    var Director = sequelize.define('director', {

        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            validate: {
                isInt: true
            }
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        }

    }, {
        timestamps: false,

        associate: function (models) {
            Director.belongsTo(models.movie, { foreignKey: 'movie_id' });
        }
    });

    return Director;
};