module.exports = (sequelize, DataTypes) => {
    const Yourics = sequelize.define("ranklist",{
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
    },
    {
        timestamps: false
    });

    return Yourics;

}