import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Savings",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      savings_name: { type: DataTypes.STRING(100), allowNull: false },
      rate: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      profit: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "pending",
      },
      date: { type: DataTypes.DATE, allowNull: false },
      transactionid: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      tableName: "savings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
