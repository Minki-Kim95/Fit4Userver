module.exports = (sequelize, DataTypes) => {
    const Clothing = sequelize.define('Clothing', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
      cname: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '옷 이름'
      },
      // uid: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: '유저 id'
      // },
      // oid: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: '옷의 종류'
      // },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '조회 수'
      },
      hashtag: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'hashtag'
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '옷 가격'
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '옷 판매처 링크'
      },
      photo1: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '사진1'
      },
      photo2: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '사진2'
      },
      photo3: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '사진3'
      },
    }, {
      tableName: 'clothing',
      comment: '옷 정보',
      classMethods: {
  
      }
    });
  
    Clothing.associate = (models) => {
      Clothing.belongsTo(models.User, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      Clothing.belongsTo(models.Clothoption, { foreignKey: 'oid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
      Clothing.hasMany(models.Size, { foreignKey: 'cid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return Clothing;
  };
  