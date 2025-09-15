import { DataTypes, Transaction } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Cryptos",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false }, // unique removed via migration
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      crypto_name: { type: DataTypes.STRING(100), allowNull: false },
      crypto_symbol: { type: DataTypes.STRING(50), allowNull: true },
      rate: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      profit: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      crypto_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Pending",
      },
      date: { type: DataTypes.DATE, allowNull: false },
      transactionid: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      tableName: "cryptos",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};