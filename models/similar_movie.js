module.exports = function (sequelize, DataTypes) {
    var SimilarMovie = sequelize.define('similar_movie', {

        movie_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        },

        similar_movie_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                isInt: true
            }
        },

        title: {
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
            SimilarMovie.belongsTo(models.movie, { as: 'Similar', foreignKey: 'movie_id' });
        }
    });

    return SimilarMovie;
};