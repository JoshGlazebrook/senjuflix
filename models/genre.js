module.exports = function (sequelize, DataTypes) {
    var Genre = sequelize.define('genre', {

        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        }

    }, {
        timestamps: false,

        associate: function (models) {
            Genre.belongsTo(models.movie, { foreignKey: 'movie_id' });
        }
    });

    return Genre;
};