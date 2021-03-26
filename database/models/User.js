const { verifyPassword, hashPassword, randomString } = require("../../services/main.fns");

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(320),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: "users",
        indexes: [
            { fields: ["email"], unique: true }
        ],
        hooks: {
            beforeCreate: async function (user, options) {
                if (user.password && user.changed("password")) {
                    user.password = hashPassword(user.password);
                }
            },
            beforeUpdate: async function (user, options) {
                if (user.password && user.changed("password")) {
                    user.password = hashPassword(user.password);
                }
            }
        }
    });

    User.search = function (column, value) {
        return User.findOne({
            where: {
                [column]: value
            }
        });
    }

    User.findByEmail = function (value) {
        return User.search("email", value);
    }

    User.login = async function (uid, password) {
        let user = await User.findByEmail(uid);

        if (user && user.verifyPassword(password)) {
            return user;
        } else {
            return null;
        }
    }

    // Instance Methods
    User.prototype.verifyPassword = function (password) {
        return verifyPassword(password, this.password);
    }

    return User;
}