import { DataTypes } from 'sequelize';
// import { kycUpload } from '../middleware/upload';

export default (sequelize) => {

  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    referer: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userloginOnce: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      defaultValue: '/uploads/avatars/default.png',
    },
    kycUpload: {
      type: DataTypes.STRING,
      field: 'kyc_upload',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
  });
};


