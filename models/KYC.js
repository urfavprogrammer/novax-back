import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Kyc",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      first: { type: DataTypes.STRING(255), allowNull: false },
      second: { type: DataTypes.STRING(255), allowNull: false },
      third: { type: DataTypes.STRING(255), allowNull: false },
      fourth: { type: DataTypes.STRING(255), allowNull: false },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "pending",
      },
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: "kyc",
      timestamps: false,
    }
  );
};