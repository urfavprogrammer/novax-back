import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "FundingEvent",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      source_type: { type: DataTypes.STRING(100), allowNull: false },
      source_id: { type: DataTypes.STRING(100), allowNull: true },
      deposit_id: { type: DataTypes.INTEGER, allowNull: true },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      method: { type: DataTypes.STRING(100), allowNull: true },
      currency: { type: DataTypes.STRING(100), allowNull: true },
      status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' },
      memo: { type: DataTypes.TEXT, allowNull: true },
      metadata: { type: DataTypes.JSONB || DataTypes.JSON, allowNull: true },
    },
    {
      tableName: "funding_events",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["username"] },
        { fields: ["source_type", "source_id"] },
        { fields: ["deposit_id"] },
        { fields: ["status"] },
      ],
    }
  );
};
