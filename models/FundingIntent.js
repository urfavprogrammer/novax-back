import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "FundingIntent",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      source: { type: DataTypes.STRING(100), allowNull: false }, // e.g., copyTrader|mortgage|reits|etf|crypto|savings|robo|stake
      entityId: { type: DataTypes.STRING(100), allowNull: true }, // string to be flexible across IDs
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      currency: { type: DataTypes.STRING(50), allowNull: true },
      method: { type: DataTypes.STRING(50), allowNull: true },
      memo: { type: DataTypes.TEXT, allowNull: true },
      channel: { type: DataTypes.STRING(50), allowNull: true }, // e.g., BTC/USDT when crypto
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' },
      txid: { type: DataTypes.STRING(100), allowNull: true },
      metadata: { type: DataTypes.JSONB || DataTypes.JSON, allowNull: true },
    },
    {
      tableName: "funding_intents",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["username"] },
        { fields: ["source", "entityId"] },
        { fields: ["status"] },
      ],
    }
  );
};
