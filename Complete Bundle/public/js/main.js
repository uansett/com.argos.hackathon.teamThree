var stopLoadingFlag = false;
var global_product;
var global_catnum;

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
        var pointPos = price.indexOf(".");
        price = price.substring(0,pointPos+3);
        var imgurl = $xml.find('[usage="image"]').attr("href");
        var catnum = $xml.find("Product").attr("id");
        var name = $xml.find("ShortDescription").text();
        $('.stream').append('<a href="/admin?product=1062487"><div class="object '+catnum+'" style="display:none" >'+getLabel()+'<img src="'+imgurl+'"><h4>'+price+'</h4><span class="text-muted">'+name+'( '+catnum+' )</span></div></a>');
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
            if (sParam[1] !== "")
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
    $.getScript("http://stiandev.com/proxy.php?url=https://api.homeretailgroup.com/product/argos/1062487/?apiKey=4n5wt8jqfj6b87y5p3uaxdpa&callback=addGraphForProduct");
    $('.stream').append('<input type="text" id="newprice" name="priceDrop"><button type="button" onClick="dropPrice();">Adjust Price</button>');
}

function dropPrice(){

    var jqxhr = $.get( "/changeprice?productId="+1062487+"&price="+$("#newprice").val(), function() {
        alert("Price Adjusted to "+$("#newprice").val()+".");
    });


}

function addGraphForProduct(data){
    var xmlDoc = $.parseXML( data ),
        $xml = $( xmlDoc );
    var price = $xml.find("Price").text();
    
    global_catnum = $xml.find("Product").attr("id");
    var name = $xml.find("ShortDescription").text();

    $('.stream').append('<div id="chart"><svg></svg></graph>');
    drawSnassyGraphForProduct(name);
}

function drawSnassyGraphForProduct(catnum){
    global_product = catnum;
    $('.page-header').html('Wishes for '+global_product);

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
    .tickFormat(d3.format(',f'));


d3.select('#chart svg')
    .datum(exampleData)
    .call(chart);

nv.utils.windowResize(chart.update);

return chart;
});

}

function compare(a,b) {
      if (parseInt(a.y) < parseInt(b.y))
         return -1;
      if (parseInt(a.y) > parseInt(b.y))
        return 1;
      return 0;
    }
// /productId=&price=
function exampleData() {
    var data = [[{x:'1200',y:'80'},{x:'1000',y:'68'},{x:'1100',y:'56'},{x:'900',y:'18'},{x:'800',y:'10'},{x:'200',y:'3'}],[{x:'1200',y:'210'},{x:'1000',y:'99'},{x:'1100',y:'90'},{x:'900',y:'20'},{x:'800',y:'7'},{x:'200',y:'0'}]];

    data[0].sort(compare);
    data[1].sort(compare);
    return data.map(function(data, i) {
        console.log(stream_layers(2,14));
        var thiskey;
        if(i == 0) thiskey = 'Wishes this month';
        else thiskey = 'Wishes last three  months';
        
        return {
            key: thiskey,
           values: data
        };
    });
} 

function stream_layers(n, m, o) {
    if (arguments.length < 3) o = 0;
    function bump(a) {
        var x = 1 / (.1 + Math.random()),
            y = 2 * Math.random() - .5,
            z = 10 / (.1 + Math.random());
        for (var i = 0; i < m; i++) {
            var w = (i / m - y) * z;
            a[i] += x * Math.exp(-w * w);
        }
    }
    return d3.range(n).map(function() {
        var a = [], i;
        for (i = 0; i < m; i++) a[i] = o + o * Math.random();
        for (i = 0; i < 5; i++) bump(a);
        return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
    return d3.range(n).map(function(i) {
        return d3.range(m).map(function(j) {
            var x = 20 * j / m - i / 3;
            return 2 * x * Math.exp(-.5 * x);
        }).map(stream_index);
    });
}

function stream_index(d, i) {
    return {x: i, y: Math.max(0, d)};
}

