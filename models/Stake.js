import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Stake",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false},
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      stake_name: { type: DataTypes.STRING(100), allowNull: false },
      rate: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      profit: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: "stakes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "update_at",
    }
  );
};
