module.exports = (sequelize, Sequelize) => {
  const Inventory = sequelize.define("inventory", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      onDelete: "CASCADE",
      autoIncrement:true
    },
    stone:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    sand:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    cement:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    admixer:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    bricks_chips:{
      type:Sequelize.DECIMAL(10, 2),
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

  return Inventory;
};
