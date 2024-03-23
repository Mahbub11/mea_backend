module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("projects", {
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mpa:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "mpa needs to provide" },
      },
    },
    cubic_meter:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "cubic_meter needs to provide" },
      },
    },
    cft_quantity:{
      type:Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "cft needs to provide" },
      },
    },
    
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return Project;
};
