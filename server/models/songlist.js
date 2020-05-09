module.exports = (sequelize, DataTypes) => {
    const Yourics = sequelize.define("songlist",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        queryName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        videoId: {
            type: DataTypes.STRING,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false
        },

        channelId: {
            type: DataTypes.STRING,
            allowNull: false
        },

        channelTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },

        publishedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()')
        }
    },
    {
        timestamps: false   // createdAt, updatedAt 자동생성 방지
    });

    return Yourics;

}