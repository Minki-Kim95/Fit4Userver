module.exports = (sequelize, DataTypes) => {
    const cloth_like_relation = sequelize.define('cloth_like_relation', {
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
  
    cloth_like_relation.associate = (models) => {
        cloth_like_relation.belongsTo(models.clothing, { foreignKey: 'cid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        cloth_like_relation.belongsTo(models.user, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return cloth_like_relation;
  };
  