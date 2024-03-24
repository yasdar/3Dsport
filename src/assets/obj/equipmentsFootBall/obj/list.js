

let equipments_Football=[];
//requiring path and fs modules
const path = require('path');
const fs = require('fs');

//joining path of directory 
const directoryPath = path.join(__dirname, './');

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/list.ts', {flags : 'w'});
//var log_stdout = process.stdout;

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        convert(file)
       
    });

    setTimeout(function(){ 
        log_file.write("//------------------------------------------------\n");
       // log_stdout.write("//------------------------------------------------\n");
        for( let v = 0 ; v< equipments_Football.length; v++){
            let st=',\n';
            log_file.write('{pathObj:"'+equipments_Football[v].pathObj + '",SC:0.33'+'}'+st);
           // log_stdout.write('{pathObj:"'+equipments_Football[v].pathObj + '",SC:0.33'+'}'+st);
        }
        ; }, 2000);
});

function convert(filename){
    if (filename.indexOf('.glb') != -1){
        let data ={
            pathObj:'/'+filename,
            SC:0.33
           };
           equipments_Football.push(data);
    }
          
}
//convert("p1.png")