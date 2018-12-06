module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define('Size', {
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
    topsize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '상의 사이즈'
    },
    top_length: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '상의 길이'
    },
    shoulder_width: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '어깨 너비'
    },
    bust: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '가슴 단면'
    },
    sleeve: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '소매 길이'
    },
    down_length: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '상의 사이즈'
    },
    thigh: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '허벅지 단면'
    },
    rise: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '밑위'
    },
    hem: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '밑단단면'
    },
    waist: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '허리둘레'
    }
  }, {
    tableName: 'size',
    comment: '옷 사이즈 정보',
    classMethods: {

    }
  });

  Size.associate = (models) => {
      Size.belongsTo(models.Clothing, { foreignKey: 'cid', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }
  return Size;
};
