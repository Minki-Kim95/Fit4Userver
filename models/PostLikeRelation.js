module.exports = (sequelize, DataTypes) => {
    const post_like_relation = sequelize.define('post_like_relation', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
      // uid: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: '유저 id'
      // },
      // pid: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: 'post id'
      // }
    }, {
      tableName: 'post_like_relation',
      comment: 'post에 대한 좋아요 정보',
      classMethods: {
  
      }
    });
  
    post_like_relation.associate = (models) => {
        post_like_relation.belongsTo(models.user, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        post_like_relation.belongsTo(models.post, { foreignKey: 'pid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return post_like_relation;
  };
  