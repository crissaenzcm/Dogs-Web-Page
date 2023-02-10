const { DataTypes, UUIDV4 } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "dog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      minHeight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maxHeight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      minWeight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maxWeight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      life_span: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdInDb: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
