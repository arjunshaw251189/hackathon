var metadata = [];
var Column1 = {};
Column1.name = "_id";
Column1.visible = false;
metadata.push(Column1);

var Column3 = {};
Column3.name = "createdOn";
Column3.visible = false;
metadata.push(Column3);

var Column5 = {};
Column5.name = "mainsubject";
Column5.visible = true;
metadata.push(Column5);

var Column5 = {};
Column5.name = "incNo";
Column5.visible = true;
metadata.push(Column5);

var Column5 = {};
Column5.name = "status";
Column5.visible = true;
metadata.push(Column5);


$(document).ready(function () {
    showAnything_mongoVer('mailbox', 'mailbox',
        '_id,createdOn,mainsubject,incNo,status',
        'id,Created On,Mails,Ticket No,Status', metadata, "", true, '../outlook/getinbox');
});