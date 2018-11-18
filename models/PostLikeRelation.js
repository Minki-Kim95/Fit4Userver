module.exports = (sequelize, DataTypes) => {
    const Post_like_relation = sequelize.define('Post_like_relation', {
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
  
    Post_like_relation.associate = (models) => {
        Post_like_relation.belongsTo(models.User, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Post_like_relation.belongsTo(models.Post, { foreignKey: 'pid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return Post_like_relation;
  };
  