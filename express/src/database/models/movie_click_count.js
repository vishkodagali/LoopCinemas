module.exports = (sequelize, DataTypes) =>
  sequelize.define("movie_click_count", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    click_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
