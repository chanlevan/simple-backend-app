let env = process.env.NODE_ENV || 'dev'

config = require('./config.json')

let envConfig = config["env"][env]

Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
});
