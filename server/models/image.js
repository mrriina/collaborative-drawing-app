const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Image = sequelize.define('image', {
    boardId: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    imageUrl: {type: DataTypes.STRING, require:true},
  });
  
  module.exports = {Image};