var stopLoadingFlag = false;

if(getURLParameters("product")){
    stopLoadingFlag = true;    
}
$(document).ready(function(){
    // D.R.Y - Do Repeat Yourself
    if(stopLoadingFlag){
        var params = getURLParameters("product");
        addProductListing(params);
    }
});


function loadProduct(data){
    if(!stopLoadingFlag){
        var xmlDoc = $.parseXML( data ),
            $xml = $( xmlDoc );
        var price = $xml.find("Price").text();
        var imgurl = $xml.find('[usage="image"]').attr("href");
        var catnum = $xml.find("Product").attr("id");
        var name = $xml.find("ShortDescription").text();
        $('.stream').append('<a href="index.html?product='+catnum+'"><div class="object '+catnum+'" style="display:none" >'+getLabel()+'<img src="'+imgurl+'"><h4>'+price+'</h4><span class="text-muted">'+name+'( '+catnum+' )</span></div></a>');
        $('div:hidden:first').fadeIn(1000);
    }
}

function getLabel(){
    var rand = getRandomArbitrary(1,100);
    if(rand < 30)
        return '<span class="label label-success">'+rand+'</span>';
    else if (rand < 60)
        return '<span class="label label-warning">'+rand+'</span>';
    else 
        return '<span class="label label-danger">'+rand+'</span>';


}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


function getURLParameters(paramName) 
{
    var sURL = window.document.URL.toString();  
    if (sURL.indexOf("?") > 0)
    {
        var arrParams = sURL.split("?");         
        var arrURLParams = arrParams[1].split("&");      
        var arrParamNames = new Array(arrURLParams.length);
        var arrParamValues = new Array(arrURLParams.length);     
        var i = 0;
        for (i=0;i<arrURLParams.length;i++)
        {
            var sParam =  arrURLParams[i].split("=");
            arrParamNames[i] = sParam[0];
            if (sParam[1] != "")
                arrParamValues[i] = unescape(sParam[1]);
            else
                arrParamValues[i] = false;
        }

        for (i=0;i<arrURLParams.length;i++)
        {
            if(arrParamNames[i] == paramName){
                return arrParamValues[i];
            }
        }
        return false;
    }

}


function addProductListing(parameter){
    // PROD
    // $.getScript("http://stiandev.com/proxy.php?url=https://api.homeretailgroup.com/product/argos/9134290/?apiKey=et6qxnqrjbmqzrkh4spajzqs&callback=addGraphForProduct");
    // UAT1
    $.getScript("http://stiandev.com/proxy.php?url=https://api.homeretailgroup.com/product/argos/9134290/?apiKey=4n5wt8jqfj6b87y5p3uaxdpa&callback=addGraphForProduct");
}

function addGraphForProduct(data){
    var xmlDoc = $.parseXML( data ),
        $xml = $( xmlDoc );
    var price = $xml.find("Price").text();
    var catnum = $xml.find("Product").attr("id");
    var name = $xml.find("ShortDescription").text();

    $('.stream').append('<div class="graph '+catnum+'"></graph>');
    drawSnassyGraphForProduct(catnum);
}

function drawSnassyGraphForProduct(catnum){

    nv.addGraph(function() {
        var chart = nv.models.multiBarChart()
        .transitionDuration(350)
        .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
        .rotateLabels(0)      //Angle to rotate x-axis labels.
        .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
        .groupSpacing(0.1)    //Distance between each group of bars.
        ;

    chart.xAxis
        .tickFormat(d3.format(',f'));

    chart.yAxis
        .tickFormat(d3.format(',.1f'));

    d3.select('#chart1 svg')
        .datum(exampleData())
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
    });

    function exampleData() {
        return stream_layers(3,10+Math.random()*100,.1).map(function(data, i) {
            return {
                key: 'Stream #' + i,
               values: data
            };
        });
    })

}


