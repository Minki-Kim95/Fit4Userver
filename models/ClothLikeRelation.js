module.exports = (sequelize, DataTypes) => {
    const Cloth_like_relation = sequelize.define('Cloth_like_relation', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
    //   cid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     comment: '옷 id'
    //   },
    //   uid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     comment: '유저 id'
    //   }
    }, {
      tableName: 'cloth_like_relation',
      comment: '옷 좋아요 정보',
      classMethods: {
  
      }
    });
  
    Cloth_like_relation.associate = (models) => {
        Cloth_like_relation.belongsTo(models.Clothing, { foreignKey: 'cid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Cloth_like_relation.belongsTo(models.User, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return Cloth_like_relation;
  };
  