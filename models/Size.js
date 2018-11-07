module.exports = (sequelize, DataTypes) => {
    const size = sequelize.define('size', {
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
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '옷 대표 사이즈'
      },
      waist: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '허리둘레'
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '길이'
      }
    }, {
      tableName: 'size',
      comment: '옷 사이즈 정보',
      classMethods: {
  
      }
    });
  
    size.associate = (models) => {
        size.belongsTo(models.clothing, { foreignKey: 'cid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
    return size;
  };
  