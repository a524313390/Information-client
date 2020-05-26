let host=function(){
	let hostname=window.location.hostname;
	let protocol=window.location.protocol;
	let port=window.location.port;
	let httpname=protocol+'//'+hostname+':'+port
	console.log(port)
	console.log(httpname)
	return httpname
}
export default host;