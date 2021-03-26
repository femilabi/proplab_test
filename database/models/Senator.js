module.exports = function (sequelize, DataTypes) {
    const Senator = sequelize.define("Senator", {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING(11),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(320),
            allowNull: false
        },
        state: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: "senators",
        indexes: [
            { fields: ["email"], unique: true }
        ]
    });

    Senator.search = function (column, value) {
        return Senator.findOne({
            where: {
                [column]: value
            }
        });
    }

    return Senator;
}