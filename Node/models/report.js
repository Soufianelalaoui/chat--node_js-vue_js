'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Report extends Model {
        static associate(models) {
            // define association here
            models.Report.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false
                }
            })
        }
    }
    Report.init({
        userId: DataTypes.INTEGER,
        UserFriendId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Report',
    });
    return Report;
};
