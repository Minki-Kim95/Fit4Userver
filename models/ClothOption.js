module.exports = (sequelize, DataTypes) => {
    const Clothoption = sequelize.define('Clothoption', {
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
        comment: '상하의 여부 0: 외투, 1: 상의, 2: 하의'
      }
    }, {
      tableName: 'clothoption',
      comment: '옷 종류',
      classMethods: {
  
      }
    });
  
    Clothoption.associate = (models) => {
        Clothoption.hasMany(models.Clothing, { foreignKey: 'oid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return Clothoption;
  };
  