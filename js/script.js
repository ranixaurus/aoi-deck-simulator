//node requires
var File = require("fs");
var Xlsx = require("xlsx");
var Unit = require("./app/unit.js");

//node functions
function readFile(filename, callback){
    File.readFile(filename, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            callback(data.toString());
        }
    });
}

function writeFile(filename, data, callback){
    File.writeFile(filename, data, function(err){
        if(err){
            console.log(err);
        }
        else{
            callback();
        }
    });
}

//start point
$(document).ready(function(){
    // ==== DATA ====
    //live
    var database = TAFFY(); 
    var history = {
        current: null,
        previous: null
    }
    //constants
    var A = "A".charCodeAt(0);
    
    // ==== CACHE ====
    //component cache
    var initLoader = $("#preloaderFull");
    
    // ==== ACTION HANDLERS ====
    //page changing mechanism
    $(".page-link").click(function(){
        var t = $(this);
        var target = t.data("page");
        
        $(".page").hide();
        var page = $("#" + target).show();
        
        page.find(".page-section").hide();
        page.find(".page-section-default").show();
        
    });
    //section changing mechanism
    $(".page-section-link").click(function(){
        var btn = $(this);
        var page = btn.parents(".page");
        var section = btn.data("section");
        
        page.find(".page-section").hide();
        page.find("#" + section).show();
    });
    //upload sheet data
    $("#UploadSheet").submit(function(){
       var path = $(this).find("input[type=file]").get(0).files[0].path;
       var workbook = Xlsx.readFile(path);
       processUploadSheet(workbook, Unit.WIKI_HEADER);
       return false; 
    });
    
    // ==== INITIAL SETUP ====
    //pages
    $(".page").hide();
    $(".page-default").show();
    //select
    $('select').material_select();
    // sidenav button
    $(".button-collapse").sideNav({
        menuWidth: 250,
        edge: 'left',
        closeOnClick: true,
        draggable: true
    });
    
    //functions
    function processUploadSheet(workbook, headerCheck){
        var err = 0;
        var wblen = workbook.SheetNames.length;
        if(wblen != 1) err = 1;
        
        var cells = workbook.Sheets[workbook.SheetNames[0]];
        var range = cells["!ref"];
        var rangeLast = range.substring(range.indexOf(":") + 1, range.length);
        var sheet = {
            "columns": rangeLast.substring(0, rangeLast.search(/\d/)).charCodeAt(0) - "A".charCodeAt(0) + 1,
            "rows": parseInt(rangeLast.substring(rangeLast.search(/\d/), rangeLast.length))
        }
        
        var valid = true;
        var startrow = 1;
        if(headerCheck != null && headerCheck.length > 0){
            var headerlen = headerCheck.length;
            for(var i = 0; i < headerlen; i++){
                var cell = String.fromCharCode(A + i) + 1;
                if(!cells.hasOwnProperty(cell) || cells[cell].v.trim().toUpperCase() != headerCheck[i].trim().toUpperCase()){
                    valid = false;
                    break;
                }
            }
            startrow++;
        }
        
        if(valid){
            for(var row = startrow; row <= sheet.rows; row++){
                var data = [];
                for(var col = A; col < A + sheet.columns; col++){
                    var value = "";
                    var cell = String.fromCharCode(col) + row;
                    if(cells.hasOwnProperty(cell)){
                        value = cells[cell].v;
                    }
                    data.push(value);
                }
                //database.insert(createDataUnitFromWiki(data));
                console.log(Unit.createFromWiki(data));
            }
        }
        else{
            console.log("Wrong excel format. Please refer to template");
        }
    }
    
    /*
    readFile("test.db", function(data){
       database = JSON.parse(data);
       initLoader.fadeOut('slow', function(){
           console.log(database);
       });
    });
    */
});