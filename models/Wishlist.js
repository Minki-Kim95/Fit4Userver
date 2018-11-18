module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
    //   uid: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     comment: '유저id'
    //   },
    //   top_outer: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '아우터의 정보'
    //   },
    //   top_1: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '안에 입을옷'
    //   },
    //   top_2: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '바깥에 입을 옷'
    //   },
    //   down: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '하의 정보'
    //   }
    //   top_outer_size: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '아우터의 사이즈'
    //   },
    //   top_1_size: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '안에 입을옷'
    //   },
    //   top_2_size: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '바깥에 입을 옷'
    //   },
    //   down_size: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     comment: '하의 정보'
    //   }
    }, {
      tableName: 'wishlist',
      comment: '유저가 담은 스타일 정보',
      classMethods: {
  
      }
    });
  
    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.User, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Clothing, { foreignKey: 'top_outer', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Size, { foreignKey: 'top_outer_size', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Clothing, { foreignKey: 'top_1', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Size, { foreignKey: 'top_1_size', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Clothing, { foreignKey: 'top_2', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Size, { foreignKey: 'top_2_size', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Clothing, { foreignKey: 'down', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Wishlist.belongsTo(models.Size, { foreignKey: 'down_size', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return Wishlist;
  };

  