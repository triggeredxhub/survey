'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Response extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Response.init({
    responseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    surveyNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Department:{ 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employeeNo:{ 
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Response',
  });
  return Response;
};