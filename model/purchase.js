module.exports = (sequelize, Sequelize) => {
  const Purchase = sequelize.define("purchase", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      onDelete: "CASCADE",
      autoIncrement:true
    },
    stone:{
      type:Sequelize.JSON,
      allowNull: true,
    },
    sand:{
      type:Sequelize.JSON,
      allowNull: true,
    },
    cement:{
      type:Sequelize.JSON,
      allowNull: true,
    },
    admixer:{
      type:Sequelize.JSON,
      allowNull: true,
    },
    bricks_chips:{
      type:Sequelize.JSON,
      allowNull: true,
    },
    miscellaneous:{
      type:Sequelize.JSON,
      allowNull: true,
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    freezeTableName: true
});

  return Purchase;
};
