var str_url = "mongodb://" + 
	process.env.GAMBIT_DB_USER + ":" + 
	process.env.GAMBIT_DB_PASSWORD + 
	"@ds012578.mlab.com:12578/gambit_messenger";

module.exports = {
	url: str_url
};