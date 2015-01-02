module.exports = function (sequelize, DataTypes) {
    var Movie = sequelize.define('movie', {

        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1,
            validate: {
                min: 1800,
                max: 2100
            }
        },

        mpaa_rating: {
            type: DataTypes.STRING,
            allowNull: true
        },

        runtime: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1
        },

        poster_url: {
            type: DataTypes.STRING,
            allowNull: true
        },

        critic_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },

        audience_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: -1
        },

        synopsis: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        studio: {
            type: DataTypes.STRING,
            allowNull: true
        },

        release_date: {
            type: DataTypes.DATE,
            allowNull: true
        }

    }, {
        timestamps: false,

        associate: function (models) {
            Movie.hasMany(models.actor, { foreignKey: 'movie_id' });
            Movie.hasMany(models.genre, { foreignKey: 'movie_id' });
            Movie.hasMany(models.director, { foreignKey: 'movie_id' });
            Movie.hasMany(models.review, { foreignKey: 'movie_id' });
            Movie.hasMany(models.similar_movie, { foreignKey: 'movie_id', as: 'Similar' });
        }

    });

    return Movie;
};