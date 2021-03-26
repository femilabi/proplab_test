const { Sequelize, DataTypes } = require("sequelize");
const glob = require("glob");
const path = require("path");

const { config } = require("../services/main.fns");

const sequelize = new Sequelize(config("db_conf.name"), config("db_conf.username"), config("db_conf.password"), {
    host: config("db_conf.host"),
    dialect: config("db_conf.dialect"),
    hooks: {
        beforeDefine: function (columns, model) {
            model.tableName = model.tableName;
        }
    }
});

let models = {};

glob.sync("./database/models/*.js").forEach(function (file) {
    let model_name = path.parse(file)["name"];
    models[model_name] = require(path.resolve(file))(sequelize, DataTypes);
});

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

sequelize.sync({ alter: true });

// module.exports = models;
module.exports = {
    models,
    sequelize
};