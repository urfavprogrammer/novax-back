import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Contact",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(100), allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      subject: { type: DataTypes.STRING(150), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },

    },
    {
      tableName: "contacts",
      timestamps: true,
      createdAt: "created_at",
      // Migration created column 'updated_at'; previously typo 'update_at' caused SELECT errors
      updatedAt: "updated_at",
    }
  );
};
