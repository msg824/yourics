module.exports = (sequelize, DataTypes) => {
  const lyrics = sequelize.define('lyricslist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    queryName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true
    },

    artist: {
      type: DataTypes.STRING,
      allowNull: true
    },

    album: {
      type: DataTypes.STRING,
      allowNull: true
    },

    lyrics: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('now()')
    }
  },
    {
      timestamps: false
    });

  return lyrics;
}