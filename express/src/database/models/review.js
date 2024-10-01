module.exports = (sequelize, DataTypes) =>
  sequelize.define("review", {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    review_description: {
      type: DataTypes.TEXT,
      allowNull: false
    }, 
    review_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
