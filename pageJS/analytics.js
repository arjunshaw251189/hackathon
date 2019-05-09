///METADATA////////////////////////////////////////
var metadata = [];
var Column1 = {};
Column1.name = "_id";
Column1.visible = false;
metadata.push(Column1);

//var Column2 = {};
//Column2.name = "solution_cluster_id";
//Column2.visible = true;
//metadata.push(Column2);

var Column3 = {};
Column3.name = "Module";
Column3.visible = true;
metadata.push(Column3);

//var Column4 = {};
//Column4.name = "Module_SubModule";
//Column4.visible = true;
//metadata.push(Column4);

var Column5 = {};
Column5.name = "Solution";
Column5.visible = true;
metadata.push(Column5);

//var Column6 = {};
//Column6.name = "Issue Description";
//Column6.visible = true;
//metadata.push(Column6);

///////////////////////////////////////////////////////////

var cleanigMetadata = [];
var Column21 = {};
Column21.name = "_id";
Column21.visible = false;
cleanigMetadata.push(Column21);

var Column22 = {};
Column22.name = "Status";
Column22.visible = true;
cleanigMetadata.push(Column22);

var Column23 = {};
Column23.name = "Description";
Column23.visible = false;
cleanigMetadata.push(Column23);

var Column24 = {};
Column24.name = "Percentage";
Column24.visible = true;
cleanigMetadata.push(Column24);

var Column25 = {};
Column25.name = "Start";
Column25.visible = true;
cleanigMetadata.push(Column25);

var Column26 = {};
Column26.name = "End";
Column26.visible = true;
cleanigMetadata.push(Column26);
//////////////////////////////////////////////////////////

var TrainingMetadata = [];
var Column31 = {};
Column31.name = "_id";
Column31.visible = false;
TrainingMetadata.push(Column31);

var Column32 = {};
Column32.name = "Status";
Column32.visible = true;
TrainingMetadata.push(Column32);

var Column33 = {};
Column33.name = "Description";
Column33.visible = false;
TrainingMetadata.push(Column33);

var Column34 = {};
Column34.name = "Percentage";
Column34.visible = true;
TrainingMetadata.push(Column34);

var Column35 = {};
Column35.name = "Start";
Column35.visible = true;
TrainingMetadata.push(Column35);

var Column36 = {};
Column36.name = "End";
Column36.visible = true;
TrainingMetadata.push(Column36);


///////////////////////////////////////////////////

$(document).ready(function () {
    showAnything_mongoVer('clusterTableanalytics', 'clusterTableanalytics',
        '_id,Module,Solution',
        'id,Module,Solution', metadata, "", true, '../Datatable/getdatatabledata?target=6611_dump&columns__=Module,Solution,Ticket Solution');
    showAnything_mongoVer('cleaning_log', 'cleaning_log',
        '_id,Status,Description,Percentage,Start,End',
        'id,Status,Description,Percentage,Start,End', cleanigMetadata, "", true, '../Datatable/getdatatabledata?target=log&columns__=Cleaning.status,Cleaning.description,Cleaning.per,Cleaning.starttime,Cleaning.endtime');
    showAnything_mongoVer('training_log', 'training_log',
        '_id,Status,Description,Percentage,Start,End',
        'id,Status,Description,Percentage,Start,End', TrainingMetadata, "", true, '../Datatable/getdatatabledata?target=log&columns__=Trainig.status,Trainig.description,Trainig.per,Trainig.starttime,Trainig.endtime');
    
});