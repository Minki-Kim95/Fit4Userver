module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      // id: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   primaryKey: true
      // },
      userid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '유저 id'
      },
      pw: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '유저 pw'
      },
      uname: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '실명'
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '닉네임'
      },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '성별 (남자:1 여자:2)'
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '키'
      },
      topsize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '상의 사이즈'
      },
      waist: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '허리 둘레'
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '프로필 사진 이미지 경로'
      },
      intro: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '자기 소개'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'email'
      }
    }, {
      tableName: 'user',
      comment: '사용자 정보',
      classMethods: {
  
      }
    });
  
    User.associate = (models) => {
      User.hasMany(models.Clothing, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        //User.hasMany(models.User_realation, { foreignKey: 'id_one', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        //User.hasMany(models.User_realation, { foreignKey: 'id_two', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        User.hasMany(models.comment, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        User.hasMany(models.Cloth_like_relation, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        User.hasMany(models.Post_like_relation, { foreignKey: 'uid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return User;
  };
  