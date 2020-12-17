module.exports = (sequelize, DataTypes) => {
  const Yourics = sequelize.define("ranklist", {
    rank: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    artist: {
      type: DataTypes.STRING,
      allowNull: false
    },

    album: {
      type: DataTypes.STRING,
      allowNull: false
    },

    videoId: {
      type: DataTypes.STRING,
      allowNull: true
    },

    videoMvId: {
      type: DataTypes.STRING,
      allowNull: true
    },

    lyrics: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
  },
    {
      timestamps: false
    });

  return Yourics;
}