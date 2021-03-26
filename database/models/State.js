module.exports = function (sequelize, DataTypes) {
    const State = sequelize.define("State", {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true
        },
        state: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        tableName: "states"
    });

    State.search = function (column, value) {
        return State.findOne({
            where: {
                [column]: value
            }
        });
    }

    return State;
}