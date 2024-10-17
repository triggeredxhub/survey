'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Survey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Survey.init({
    surveyId:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    surveyTitle:{ 
      type:DataTypes.STRING,
      allowNull:false
    },
    surveyQuestion:{
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    tableName: 'surveys',
    modelName: 'Survey',
  });
  return Survey;
};