module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
      // pid: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: 'post id'
      // },
      // uid: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   comment: 'user id'
      // },
      contents: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '댓글 내용'
      }
    }, {
      tableName: 'comment',
      comment: '댓글 정보',
      classMethods: {
  
      }
    });
  
    comment.associate = (models) => {
        comment.belongsTo(models.User, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        comment.belongsTo(models.Post, { foreignKey: 'pid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return comment;
  };
  