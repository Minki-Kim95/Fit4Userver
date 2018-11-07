module.exports = (sequelize, DataTypes) => {
    const clothoption = sequelize.define('clothoption', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
      oname: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '옷 종류 이름'
      },
      topdown: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '상하의 여부'
      }
    }, {
      tableName: 'clothoption',
      comment: '옷 종류',
      classMethods: {
  
      }
    });
  
    clothoption.associate = (models) => {
        clothoption.hasMany(models.clothing, { foreignKey: 'oid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return clothoption;
  };
  