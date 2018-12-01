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
      season: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '계절요소 0: 공용 1:봄,가을 2:여름, 3:겨울'
      },
      mallname: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '쇼핑몰 이름'
      },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '옷성별 (공용:0 남자:1 여자:2)'
      },
      basicimage: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '기본이미지'
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
  