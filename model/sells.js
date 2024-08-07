module.exports = (sequelize, Sequelize) => {
  const Sells = sequelize.define("sells", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      onDelete: "CASCADE",
      autoIncrement:true
    },
    cid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "companys", key: "id" },
      onDelete: "CASCADE",
    },
    pid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "projects", key: "id" },
      onDelete: "CASCADE",
    },
    mpa:{
      type:Sequelize.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notNull: { msg: "mpa needs to provide" },
      },
    },
    stone:{
      type:Sequelize.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notNull: { msg: "stone needs to provide" },
      },
    },
    sand:{
      type:Sequelize.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notNull: { msg: "sand needs to provide" },
      },
    },
    cement:{
      type:Sequelize.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notNull: { msg: "cement needs to provide" },
      },
    },
    admixer:{
      type:Sequelize.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notNull: { msg: "admixer needs to provide" },
      },
    },
    cubic_meter:{
      type:Sequelize.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notNull: { msg: "cubic_meter needs to provide" },
      },
    },
    cft_quantity:{
      type:Sequelize.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notNull: { msg: "cft needs to provide" },
      },
    },
    sell_date: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return Sells;
};
