import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Payment",
    {
      payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      btc: { type: DataTypes.STRING(100), allowNull: true },
      eth: { type: DataTypes.STRING(100), allowNull: true },
      usdt_erc20: { type: DataTypes.STRING(100), allowNull: true },
      usdt_trc20: { type: DataTypes.STRING(100), allowNull: true },
      ada: { type: DataTypes.STRING(100), allowNull: true },
      account_name: { type: DataTypes.STRING(100), allowNull: true },
      account_number: { type: DataTypes.STRING(100), allowNull: true },
      bank_name: { type: DataTypes.STRING(100), allowNull: true },
      account_type: { type: DataTypes.STRING(100), allowNull: true },
      routing_number: { type: DataTypes.STRING(100), allowNull: true },
      swift_code: { type: DataTypes.STRING(100), allowNull: true },
      bank_address: { type: DataTypes.STRING(200), allowNull: true },
      beneficiary_address: { type: DataTypes.STRING(200), allowNull: true },
    },
    {
      tableName: "payments",
      timestamps: false,
    }
  );
};
