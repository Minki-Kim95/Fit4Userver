module.exports = (sequelize, DataTypes) => {
    const clothing = sequelize.define('clothing', {
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
      }
    }, {
      tableName: 'clothing',
      comment: '옷 정보',
      classMethods: {
  
      }
    });
  
    clothing.associate = (models) => {
        clothing.belongsTo(models.user, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        clothing.belongsTo(models.clothoption, { foreignKey: 'oid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        clothing.hasMany(models.post, { foreignKey: 'top', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        clothing.hasMany(models.post, { foreignKey: 'down', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        clothing.hasMany(models.size, { foreignKey: 'cid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return clothing;
  };
  