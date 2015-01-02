module.exports = function (sequelize, DataTypes) {
    var Actor = sequelize.define('actor', {

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
        },

        character: {
            type: DataTypes.STRING,
            allowNull: false
        },

        poster_url: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }, {
        timestamps: false,

        associate: function (models) {
            Actor.belongsTo(models.movie, { foreignKey: 'movie_id' });
        }
    });

    return Actor;
};