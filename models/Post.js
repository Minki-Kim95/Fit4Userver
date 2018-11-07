module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
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
      // top: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: '옷의 종류(상의)'
      // },
      // down: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: '옷의 종류(하의)'
      // },
      hashtag: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'hashtag'
      }
    }, {
      tableName: 'post',
      comment: '스타일 정보',
      classMethods: {
  
      }
    });
  
    post.associate = (models) => {
        post.belongsTo(models.user, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        post.belongsTo(models.clothing, { foreignKey: 'top', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        post.belongsTo(models.clothing, { foreignKey: 'down', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        post.hasMany(models.comment, { foreignKey: 'pid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        post.hasMany(models.post_like_relation, { foreignKey: 'pid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return post;
  };
  