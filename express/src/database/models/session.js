module.exports = (sequelize, DataTypes) =>
  sequelize.define("session", {
    session_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, session_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    session_ticket_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });