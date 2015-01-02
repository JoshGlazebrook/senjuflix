module.exports = function (sequelize, DataTypes) {
    var Queue = sequelize.define('queue', {

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
            Queue.belongsTo(models.account, { foreignKey: 'account_id' });
        }
    });

    return Queue;
};