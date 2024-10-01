module.exports = (sequelize, DataTypes) =>
  sequelize.define("movie", {
    movie_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    movie_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },image: {
      type: DataTypes.STRING(40),
      allowNull: true
    },corouselImage:{
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
