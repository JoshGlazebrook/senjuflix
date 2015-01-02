module.exports = function (sequelize, DataTypes) {
    var Review = sequelize.define('review', {

        movie_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },

        critic_name: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },

        quote: {
            type: DataTypes.STRING,
            allowNull: false
        },

        fresh: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false
        }

    }, {
        timestamps: false,

        associate: function (models) {
            Review.belongsTo(models.movie, { foreignKey: 'movie_id' });
        }
    });

    return Review;
};