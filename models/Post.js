module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
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
      hashtag: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'hashtag'
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'photo경로'
      }
    }, {
      tableName: 'post',
      comment: '스타일 정보',
      classMethods: {
  
      }
    });
  
    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Post.hasMany(models.comment, { foreignKey: 'pid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Post.hasMany(models.Post_like_relation, { foreignKey: 'pid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return Post;
  };
  