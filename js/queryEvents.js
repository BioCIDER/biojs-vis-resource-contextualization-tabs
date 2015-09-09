var iannList = new Object();

/**
 * Display the Events
 * fieldText {string} Fields search - "bioinformatics", "biotherapeutics", "epidemiology", "epigenomics", "genomics", "immunology", "medicine", "metabolomics", "metagenomics", "pathology", "pharmacology", "physiology", "proteomics", "systems biology"
 * fieldOperator {string} Logical operator - "OR", "AND", "NOT"
 * rowsNumber {number} Indicates the maximum number of events that will be shown on the screen
 */
iannList.start = function (fieldText, fieldOperator, rowsNumber){
   
   var newUrl = iannList.getNewUrl(fieldText, fieldOperator, rowsNumber);
   iannList.getData(newUrl, fieldText, fieldOperator, rowsNumber);

};

/**
 * Create a url
 * fieldText {string} Fields search - "bioinformatics", "biotherapeutics", "epidemiology", "epigenomics", "genomics", "immunology", "medicine", "metabolomics", "metagenomics", "pathology", "pharmacology", "physiology", "proteomics", "systems biology";
 * fieldOperator {string} Logical operator - "OR", "AND", "NOT";
 * rowsNumber {number} Indicates the maximum number of events that will be shown on the screen;
 */
iannList.getNewUrl = function(fieldText, fieldOperator, rowsNumber){

    var urlText = "";
    var marksText = '"';
    var count = 0;
    var iannUrl = "";

    while (count < fieldText.length) {

        urlText += marksText+fieldText[count]+marksText;

        count++;

        if(count < fieldText.length){urlText +=fieldOperator}

    }

    var iannUrl = "http://iann.pro/solr/select/?q=field:"+urlText+"&rows="+rowsNumber+"&fl=start,title,country,provider,link&fq=start%3A[NOW%20TO%20*]&wt=json&json.wrf=?&sort=start%20asc";
    
    console.log(iannUrl)

    if(fieldText == "Services Registry" || fieldText == "Training Materials" ){

         iannUrl = "http://localhost:8983/solr/elixirData/select/?q=field:"+urlText+"&rows="+rowsNumber+"&fl=start,title,notes,link&wt=json&json.wrf=?&sort=start%20asc";
    }

    return iannUrl;
};

/**
 * Makes a Request to the Server
 * newUrl {string} url - Uniform Resource Locator
 */
iannList.getData = function(newUrl, fieldText, fieldOperator, rowsNumber){

 jQuery.ajax({
            type      : "GET",
            url       : newUrl,
            dataType  : 'json',
            success   : function(data){processResults(data, fieldText, fieldOperator, rowsNumber);},
            error     : function(e){processError(e);}
        });

};

/**
 * Validates Data
 * data {object Object}
 */
var processResults = function(data, fieldText, fieldOperator, rowsNumber) {
    //alert(JSON.stringify(data.response.docs[0]));
    if(data.response != undefined){
        if(data.response.docs != undefined){

            var target = jQuery('#section-flip-1');
                    
            if(fieldText == "Services Registry"){

                    target = jQuery('#section-flip-2');
                    buildList(data.response.docs, target, fieldText, fieldOperator, rowsNumber);

            } else if(fieldText == "Training Materials"){

                    target = jQuery('#section-flip-3');
                    buildList(data.response.docs, target, fieldText, fieldOperator, rowsNumber);
            }else{
                    buildListEvents(data.response.docs, target, fieldText, fieldOperator, rowsNumber)
            }

        } else {console.log(processError("data.response.docs undefined"));}
    } else {console.log(processError("data.response undefined"));}
}

var processError = function(error) {
    console.log("ERROR:" + error);
}

/**
 * Build the List Events
 * docs {object Object}
 */
var buildListEvents = function(docs, target, fieldText, fieldOperator, rowsNumber){
     
    target.html('');
    var table = jQuery('<div class="iannEventList"></div>').appendTo(target);
    var oddRow = true;
    jQuery.each(docs, function(rowIndex, rowData) {
        //cols {object Object}
        var cols = {'start':'','title':'','link':'','country':'','provider':''};

        jQuery.each(cols, function(colsIndex, colsData) {

            var field = rowData[colsIndex];

            if(colsIndex == 'start'){

                 field = field.substring(0,10);

                 date = field.split("-");
                 field = date[2] + "-" + date[1] + "-" + date[0];
            }

            cols[colsIndex] = field;
        });

        //iAnnDate {object Object}
        var iAnnDate = cols['start'].split("-");

        var date = new Date();

        date.setFullYear(iAnnDate[2],iAnnDate[1]-1,iAnnDate[0]);
        date = date.toString();

        var row = jQuery('<div><div class="iAnnEventTitleOdd"><a href="'+cols['link']+'" taget="_blank">'+cols['title']+'</a></div><ul class="blockInformation"><li><i class="fa fa-calendar-o"></i><span class="date">'+' '+date.substring(0,15)+'</span><br><i class="fa fa-map-marker"></i><span class="location">'+ ' ' + cols['country']+' ' +cols['provider']+'</span></li></ul></div>' + '<hr>');

        row.addClass("views-row");
        row.appendTo(table);

        var fieldText = ["Services Registry"]
        iannList.start(fieldText, fieldOperator, rowsNumber)

    });
};

/**
 * Build the List Services Registry and Training Materials
 * docs {object Object}
 */
var buildList = function(docs, target, fieldText, fieldOperator, rowsNumber){
    
    var newFieldText = fieldText

    target.html('');
    var table = jQuery('<div class="iannEventList"></div>').appendTo(target);
    var oddRow = true;
    jQuery.each(docs, function(rowIndex, rowData) { 
        //cols {object Object}
        var cols = {'start':'','title':'','link':'','notes':''};
       
        jQuery.each(cols, function(colsIndex) {
       
            var field = rowData[colsIndex];
 
            cols[colsIndex] = field;

        });
        
        strNotes = cols['notes'].substring(0,131)

        strNotes = strNotes + "..."

        var row = jQuery('<div><div class="iAnnEventTitleOdd"><a href="'+cols['link']+'" taget="_blank">'+cols['title']+'</a</div><ul class="blockInformation"><li><i class="fa fa-info-circle"></i><span class="description">'+strNotes+'</span> </li></ul></div>');


        row.addClass("views-row");
        row.appendTo(table);
   
        if(newFieldText == "Services Registry"){

            newFieldText = ["Training Materials"]
            iannList.start(newFieldText, fieldOperator, rowsNumber)
        }

    });
};



  
