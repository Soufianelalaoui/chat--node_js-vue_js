'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFriend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.UserFriend.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  UserFriend.init({
    userId: DataTypes.INTEGER,
    userFriendId: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserFriend',
  });
  return UserFriend;
};
