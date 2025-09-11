import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Ctrader",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false},
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      trader_name: { type: DataTypes.STRING(100), allowNull: false },
      rate: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      profit: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' },
      image: { type: DataTypes.STRING(255), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      date: { type: DataTypes.DATE, allowNull: false },

    },
    {
      tableName: "ctraders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};