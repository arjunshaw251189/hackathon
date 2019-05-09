var clusterTableblocker = '';
var stackpage = 0;
var listoflayer1 = [];
var clustertabledesign = '<div class="jarviswidget jarviswidget-sortable" id="wid-id-1" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-custombutton="false" role="widget"><div role="content"><div class="widget-body no-padding" style = "background-color:#ededed;" ><div id="clusterTable"></div></div></div></div>';
//CLUSTERTABLE METADATA/////////////////////////////////////////

////////////
var metadata = [];
var Column1 = {};
Column1.name = "_id";
Column1.visible = false;
metadata.push(Column1);

var Column2 = {};
Column2.name = "cluster_id";
Column2.visible = true;
metadata.push(Column2);

var Column3 = {};
Column3.name = "Module";
Column3.visible = false;
metadata.push(Column3);

var Column4 = {};
Column4.name = "Module_SubModule";
Column4.visible = false;
metadata.push(Column4);

//var Column5 = {};
//Column5.name = "Solution";
//Column5.visible = false;
//metadata.push(Column5);

var Column6 = {};
Column6.name = "Issue Description";
Column6.visible = true;
metadata.push(Column6);
///////////////////////////////////////////////////////////////
var word_cloud = '';
function getPriorityDetails(submod) {
    $.ajax({
        url: '../Home/keygroup?c=Priority&t=string&l=300&con=Sub%20Module|'+submod+'&contype=string',
        type: "GET",
        cache: false,
        dataType: 'json',
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var data_ = data.children;
            var category = [];
            var data__ = [];
            for (var i = 0; i < data_.length; i++) {
                category.push(data_[i].name);
                data__.push(data_[i].value);
            }
            $('#graph1').parent().append('<div id="graph1" style="height: 500px"></div>');
            $($('#graph1')[0]).remove()
            simpleBar('graph1', category, data__)
            
        },
        error: function (err) {
            alert("Error")
        }
    });
}
function submodulegcloud_() {
    $.ajax({
        url: "../Home/keygroup?c=Sub%20Module&t=string&l=300",
        type: "GET",
        cache: false,
        dataType: 'json',
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var clouddata = [];
            for (var i = 0; i < data.children.length; i++) {
                var data_ = {};
                data_.text = data.children[i].name;
                data_.weight = data.children[i].count;
                data_.click = 'getCategory("' + data_.text + '");getPriorityDetails("' + data_.text+'")';
                clouddata.push(data_);

            }
            getCategory(clouddata[0].text);
            getPriorityDetails(clouddata[0].text);
            word_cloud = createCLoud('wordcloud', clouddata);

            $('#wordcloud').resize(function () {
                $('#wordcloud').children().remove();
                createCLoud('wordcloud', clouddata);
                getCategory(clouddata[0].text);
                getPriorityDetails(clouddata[0].text);
            });
        },
        error: function (err) {
            alert("Error")
        }
    });
}
function getCategory(submod) {
    $.ajax({
        url: '../Home/keygroup?c=Category&t=string&l=10&con=Sub%20Module|'+submod+'&contype=string',
        type: "GET",
        cache: false,
        dataType: 'json',
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var categoryData_ = data.children;
            var data_ = {};
            data_.seriesData = categoryData_;
            data_.legendData = [];
            data_.selected = {};
            for (var i = 0; i < data_.seriesData.length; i++) {
                data_.legendData.push(data_.seriesData[i].name);
                if (data_.seriesData[i].name != 'emptystring') {
                    data_.selected[data_.seriesData[i].name] = true;
                } else {
                    if (data_.seriesData.length > 1) { data_.selected[data_.seriesData[i].name] = false; }
                    else { data_.selected[data_.seriesData[i].name] = true; }
                }
            }
            $('#graph9').parent().append('<div id="graph9" style="height: 600px"></div>');
            $($('#graph9')[0]).remove()
            piebase('graph9', data_);
            
            
        },
        error: function (err) {
            alert("Error")
        }
    });
}

function renderstacktree() {
    $('#stacktree').slideUp();
    $('#clusterTable').slideUp();
    $('#rendering_stacktree').show();
    $('#treepaging').attr('style', 'pointer-events: none;');
    if (currentStackSkip <= 0) {
        currentStackSkip = 0;
    } stackpage= (currentStackSkip / 10) + 1;
    $.ajax({
        url: "../Home/keygroup?c=cluster_id,Module,Module_SubModule&t=int,string,string&l=10&s=" + currentStackSkip,
        type: "GET",
        cache: false,
        dataType: 'json',
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            //tree('stacktree', data)
            listoflayer1 = [];
            for (var i = 0; i < data.children.length; i++) {
                listoflayer1.push(data.children[i].name);
            }
            if (stackpage > 1) {
                $('#treepaging .prev').show();
            } else { $('#treepaging .prev').hide();}
            $('#rendering_stacktree').hide();
            $('#treepaging').attr('style', '');
            if (listoflayer1.length > 0) {
                $('#stacktree').children().remove()
                renderTree('stacktree', data, 300);
                $('#clusterTableTab').DataTable().columns([2, 3]).visible(false);
                $('#clusterTableTab').DataTable().ajax.url('../Datatable/getdatatabledata?target=6611&columns__=cluster_id,Module,Module_SubModule,Issue Description&cluster_id=' + listoflayer1.toLocaleString());
                $('#clusterTableTab').DataTable().ajax.reload(null, true);
            } else {
                $('#treepaging .next').hide();
                currentStackSkip = currentStackSkip - 10;
            }
            $('#stacktree').slideDown();
            $('#clusterTable').slideDown();
       },
        error: function (err) {
            alert("Error")
        }
    });
}
var currentStackSkip = 0;
$(document).ready(function () { 

    hidemyass();
$('body').attr('style', 'overflow-x:hidden');
//    paichartver1('graph2');

//    $('#graph2').resize(function () {
//        $('#graph2').children().remove();
//    paichartver1('graph2');
//});


////Dashboard Cluster tree////////////////////////////////////////////////////////////
//var treeblocker = createblobker(false);
//$('#' + treeblocker + ' #blockingData').append(loader__); 
//block_(treeblocker);
    var word_cloud = '';
    $('#rendering_stacktree').show();
    $('#stacktree').slideUp();
    $('#clusterTable').slideUp();
$.ajax({
    url: "../Home/keygroup?c=cluster_id,Module,Module_SubModule&t=int,string,string&l=10&s=" + stackpage,
    type: "GET",
    cache: false,
    dataType: 'json',
    async: true,
    contentType: "application/json; charset=utf-8",
    success: function (data) {
        //tree('stacktree', data)
        for (var i = 0; i < data.children.length; i++) {
            listoflayer1.push(data.children[i].name);
        }
        $('#rendering_stacktree').hide();
        renderTree('stacktree', data, 300);
        //unblock_(treeblocker);
        submodulegcloud_();
        showAnything_mongoVer('clusterTable', 'clusterTable',
        '_id,cluster_id,Module,Module_SubModule,Issue Description',
            'id,clusterId,Module,SubModule,Issue', metadata, "", true, '../Datatable/getdatatabledata?target=6611&columns__=cluster_id,Module,Module_SubModule,Issue Description&cluster_id=' + listoflayer1.toLocaleString());
        $('#stacktree').slideDown();
        $('#clusterTable').slideDown();
    },
    error: function (err) {
        alert("Error")
    }
    });

    $('#treepaging .next').click(function () {
        currentStackSkip = currentStackSkip + 10;
        renderstacktree();
    });
    $('#treepaging .prev').click(function () {
        currentStackSkip = currentStackSkip - 10;
        renderstacktree();
    });
    
////////////////////////////////////////////////////////////////////////////////////////

    //createpachbubble('test', dataBubble);
});