module.exports = (sequelize, DataTypes) => {
    const User_relation = sequelize.define('User_relation', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
    //   id_one: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     comment: '유저 id'
    //   },
    //   id_two: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     comment: '유저 id'
    //   },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '유저 관계(0: 팔로우, 1: 언팔로우)'
      }
    }, {
      tableName: 'user_relation',
      comment: '유저 관계 정보',
      classMethods: {
  
      }
    });
  
    User_relation.associate = (models) => {
        User_relation.belongsTo(models.User, { foreignKey: 'id_one', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        User_relation.belongsTo(models.User, { foreignKey: 'id_two', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return User_relation;
  };
  