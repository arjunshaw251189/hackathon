var m = [10, 10, 10, 100],
    w = 0,
    h = 0,
    i = 0;
var icons = {};
icons.undefined = '\uf108';
icons.default = '\uf108';
icons.cluster_id = '\uf1c0';
icons.Module = '\uf039';
icons.Module_SubModule = '\uf037';
icons.activedirectryserver = '\uf0c0';
icons.applicationserver = '\uf085';
icons.network = '\uf1eb';
icons.log = '\uf328';
icons.cloud = '\uf385';
icons.share = '\uf126';
icons.webserver = '\uf1b3';
icons.backupserver = '\uf019';
icons.mailserver = '\uf0e0';
icons.storageserver = '\uf0a0';
icons.dump = '\uf2b5';

var root = new Object();
var tree = new Object();
var diagonal = new Object();
var vis = new Object();


function renderTree(div_name, data_, height_) {
    if (height_ == undefined) {
        height_ = 1000;
    }
    w = 1800 - m[1] - m[3];
    h = height_ - m[0] - m[2];
    i = 0;
    diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });
    tree = d3.layout.tree().size([h, w]);

    try {
        $('div[identity="tree"]').children().remove();
    } catch (e) { }
    vis = d3.select("#" + div_name).append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
   

    d3.json(null, function (json) {
        var source = data_;
        source.x0 = h / 2;
        source.y0 = 0;
        source.children.forEach(toggleAll);
        root = null;
        root = source;
        update(source, tree, diagonal, vis);
    });
}

function update(source, tree, diagonal, vis) {
    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 350; });

    // Update the nodes…
    var node = vis.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", function (d) { highlight(this); });

    nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .attr("type_", function (d) { return d.type; })
        .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; })
        .on("click", function (d) { toggle(d); update(d, tree, diagonal, vis);})
        .attr('class', function (d) { if (d.hascorelatedalert != undefined && d.hascorelatedalert) { return 'lastBullet' } else { return ""; } });

    nodeEnter.append("svg:text")
        .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("type_", function (d) { return d.type; })
        .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
        // .attr("text-anchor", function (d) { return d.children || d._children ? "start" : "start"; })
        // .text(function (d) { if (d.name != 'Root') { if (d.count > 0) { return icons[d.type] + ' ' + d.name + ' ' + d.count; } else { return icons[d.type] + ' ' + d.name; } } else { return icons[d.type] + ' ' + d.name; } })
        .text(function (d) { if (d.name != 'Root') { if (d.count > 0) { return icons[d.type] + ' ' + d.name; } else { return icons[d.type] + ' ' + d.name; } } else { return icons[d.type] + ' ' + d.name; } })
        .style("fill", function (d) { if (d.hasalert != undefined) { if (d.hasalert) { return "#b5282a"; } else { return "#006599" } } else { return "#006599"; } })
        .attr("parent_", function (d) { try { return 'CI_' + d.parent.id; } catch (e) { return ""; } })
        .attr("id", function (d) { try { return 'CI_' + d.id; } catch (e) { return ""; } })
        .attr("val_", function (d) { return d.name; })
        .on("click", function (d) { findLink(d.id); });

    nodeEnter.append("svg:text")
        .attr("x", function (d) { return d.children || d._children ? 10 : -10; })
        .attr("dy", ".35em")
        .attr("type_", function (d) { return d.type; })
        .attr("text-anchor", function (d) { return d.children || d._children ? "start" : "end"; })
        // .attr("text-anchor", function (d) { return d.children || d._children ? "start" : "start"; })
        // .text(function (d) { if (d.name != 'Root') { if (d.count > 0) { return icons[d.type] + ' ' + d.name + ' ' + d.count; } else { return icons[d.type] + ' ' + d.name; } } else { return icons[d.type] + ' ' + d.name; } })
        .text(function (d) { if (d.count > 0) { try { try { return d.count + " \uf0a9 " + d.children.length } catch (e) { return d.count + " \uf0a9 " + d._children.length } } catch (e) { return d.count } } })
        .attr("parent_", function (d) { try { return 'CI_' + d.parent.id; } catch (e) { return ""; } })
        .attr("id", function (d) { try { return 'CI_' + d.id; } catch (e) { return ""; } })
        .attr("val_", function (d) { return d.name; })
        .style("cursor", "pointer")
        .style("fill", "#005682")
        .on("click", function (d) { toggle(d); update(d, tree, diagonal, vis); });


    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 4.5)
        .attr("type_", function (d) { return d.type; })
        .style("fill", function (d) {
            if (d.hasalert != undefined && d.hasalert && d._children != undefined) { return "#d05a5a" }
            else if (d.hasalert != undefined && d.hasalert) { return "#fff" }
            else { return d._children ? "lightsteelblue" : "#fff"; }
        })
        .style("stroke", function (d) { if (d.hasalert != undefined && d.hasalert) { return "#b93a3a" } else { return d._children ? "steelblue" : "steelblue"; } });


    nodeUpdate.select("text")
        .style("fill-opacity", 1);
    nodeUpdate.select("text")
        .style("cursor", "pointer");

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = vis.selectAll("path.link")
        .data(tree.links(nodes), function (d) { return d.target.id; });

    // Enter any new links at the parent's previous position.

    link.enter().insert("svg:path", "g")
        .attr("d", function (d) {
            var o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
        })
        .attr("style", function (d) {
            if (d.target.hascorelatedalert != undefined
                && d.target.hascorelatedalert) { return "stroke: red;" }
            else if (d.source.hasalert != undefined
                && d.target.hasalert != undefined
                && d.source.hasalert
                && d.target.hasalert) { return "stroke: red; stroke-width: 0.5px;" }
            else if (d.target.hasalert != undefined
                && (d.source.hasalert != undefined || !d.source.hasalert)
                && d.target.hasalert) { return "stroke-dasharray:3; stroke: red; stroke-width: 0.5px;" }
            //else if(d.source.hasalert!=undefined
            //&& (d.target.hasalert!=undefined || !d.target.hasalert)
            // && d.source.hasalert){return "stroke-dasharray:3; stroke: red; stroke-width: 0.5px;"}
            else return ""
        })
        .attr("class", function (d) {
            if (d.target.hascorelatedalert != undefined
                && d.target.hascorelatedalert) { return "link" }
            else if (d.source.hasalert != undefined
                && d.target.hasalert != undefined
                && d.source.hasalert
                && d.target.hasalert) { return "link" }
            else if (d.target.hasalert != undefined
                && (d.source.hasalert != undefined || !d.source.hasalert)
                && d.target.hasalert) { return "link dott" }
            //else if(d.source.hasalert!=undefined
            //&& (d.target.hasalert!=undefined || !d.target.hasalert)
            //&& d.source.hasalert){return "link dott"}
            else return "link"
        })
        .attr("parent_", function (d) { try { return 'CIPATH_' + d.source.id; } catch (e) { return ""; } })
        .attr("id", function (d) { try { return 'CIPATH_' + d.target.id; } catch (e) { return ""; } })
        .transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children.
function toggleAll(d) {
    if (d.children) {
        d.children.forEach(toggleAll);
        toggle(d);
    }
}
function highlight(ele) {
    $(ele).parentsUntil("svg").find('.lastBullet').each(function () { $(this).attr('class', ''); });
    $(ele).find('circle').attr('class','lastBullet');
}
var linkarr = [];
function findLink(d) {
    var link = "";
    linkarr = [];
    d = 'CI_' + d;
    while (true) {
        var target = document.getElementById(d);
        if (link != "") {
            link = target.getAttribute("val_") + ',' + link;
        } else { link = target.getAttribute("val_"); }

        if (target.getAttribute("val_") != 'Root') {
            linkarr.push(target.getAttribute("val_"));
        }

        d = target.getAttribute("parent_");
        if (d == "") { break; }
    }
    if (page_ == 'dashboard') {
       
        $('#clusterTableTab').DataTable().columns([2, 3]).visible(false);
        if (link != 'Root') {
            goto_($("#clusterTable").parent());
            $('#clusterTableTab').DataTable().ajax.url('../Datatable/getdatatabledata?target=6611&columns__=cluster_id,Module,Module_SubModule,Issue Description&link=' + encodeURIComponent(link.replace('Root,', '')));
            $('#clusterTableTab').DataTable().ajax.reload(null, true);
            for (var i = 2; i <= linkarr.length; i++) {
                $('#clusterTableTab').DataTable().columns([i]).visible(true);
                $($('#clusterTableTab th')[i-1]).show();
            }
        } else {
            $('#clusterTableTab').DataTable().ajax.url('../Datatable/getdatatabledata?target=6611&columns__=cluster_id,Module,Module_SubModule,Issue Description&cluster_id=' + listoflayer1.toLocaleString());
            $('#clusterTableTab').DataTable().ajax.reload(null, true);
        }
    }
    console.log(link.replace('Root<', ''));
}

function toggle(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
}