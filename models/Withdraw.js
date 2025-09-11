import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Withdraw",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false , unique: true },
      trade_id: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      trade_name: { type: DataTypes.STRING(100), allowNull: false },
      wallet: { type: DataTypes.STRING(100), allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "pending",
      },
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: "withdraws",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
