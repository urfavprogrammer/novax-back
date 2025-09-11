import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "referrals",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      referral_name: { type: DataTypes.STRING(100), allowNull: false },
      amount: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      bonus_earned: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "pending",
      },
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: "referrals",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
