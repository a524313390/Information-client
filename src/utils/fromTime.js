function fromTime(time){
	
	 var d = new Date(time);
	
//	var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
	return times;
}
export default fromTime;
