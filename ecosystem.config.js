module.exports = {
  apps : [{
    name: 'server',
    script: './server/index.js',
    env_production : {
	"NODE_ENV": "production"
    }
    // watch: '.'
  }],
};