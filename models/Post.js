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
      clothingimage: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '옷사진 경로'
      },
      avatarimage: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '아바타사진 경로'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'post이름'
      },
      totalcost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '총 금액'
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '조회수'
      },
        top_outer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '아우터의 정보'
      },
      top_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '안에 입을옷'
      },
      top_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '바깥에 입을 옷'
      },
      down: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '하의 정보'
      },
      top_outer_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '아우터의 사이즈'
      },
      top_1_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '안에 입을옷'
      },
      top_2_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '바깥에 입을 옷'
      },
      down_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '하의 정보'
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
  