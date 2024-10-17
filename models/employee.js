'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employee.init({
    employeeNo:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    firstname:{ 
      type: DataTypes.STRING,
      allowNull: false
    },
    Lastname: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    Department: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Designation: { 
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'employee',
  });
  return employee;
};