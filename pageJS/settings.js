$(document).ready(function () {
    getmaildetails();
    getresultconfig();
    $('.config_mail_btn').click(function () {
        
        var data_ = {};
        var fieldsvalidated=true;
        data_.SmtpHost = $('#new_smtpserver').val();
        if (data_.SmtpHost == '') {
            fieldsvalidated = false;
        }
        data_.SmtpPort = $('#new_smtpport').val();
        if (data_.SmtpPort == '') {
            data_.SmtpPort = '25';
            fieldsvalidated = false;
        }
        data_.ImapHost = $('#new_imapserver').val();
        if (data_.ImapHost == '') {
            fieldsvalidated = false;
        }
        data_.IMAPport = $('#new_imapport').val();
        if (data_.IMAPport == '') {
            data_.IMAPport = '25';
            fieldsvalidated = false;
        }
        data_.MailBoxUser = $('#new_username').val();
        data_.MailBoxPassword = $('#new_password').val();
        if (data_.MailBoxUser == '' && data_.MailBoxPassword == '') {
            fieldsvalidated = false;
        }
        var data__ = {};
        data__.details = data_;
        if (fieldsvalidated) {
            $('.config_mail').hide();
            $('.config_mail_busy').show();

            $.ajax({
                url: "../appconfig/savemailconfiguratione",
                type: "POST",
                data: JSON.stringify(data__),
                cache: false,
                dataType: 'json',
                async: true,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data) {
                        $('.config_mail').show();
                        $('.config_mail_busy').hide();
                        basicalert("Mail configuration", "Success", 2000);
                        getmaildetails();
                    } else {
                        $('.config_mail').show();
                        $('.config_mail_busy').hide();
                        $.smallBox({
                            title: "Mail configuration",
                            content: "Failed",
                            color: "#af1a1a",
                            timeout: 2000,
                            icon: "fa fa-bell swing animated"
                        });
                    }
                },
                error: function (err) {
                    $('.config_mail').show();
                    $('.config_mail_busy').hide();
                }
            });
        } else {
            $.smallBox({
                title: "Invalid",
                content: "Empty Field Detected",
                color: "#af1a1a",
                timeout: 2000,
                icon: "fa fa-bell swing animated"
            });
        }
    });
    $('.config_result_btn').click(function () {

        $('.config_result').hide();
        $('.config_result_busy').show();
        var data_ = {};
        data_.range = $('#threshold_config').html();
        $.ajax({
            url: "../appconfig/savethresholdconfiguratione",
            type: "POST",
            data: JSON.stringify(data_),
            cache: false,
            dataType: 'json',
            async: true,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                basicalert("Threshold configuration", "Success", 2000);
                $('.config_result').show();
                $('.config_result_busy').hide();
                getresultconfig();
            },
            error: function (err) {
                $.smallBox({
                    title: "Failed",
                    content: "Threshold Not set",
                    color: "#af1a1a",
                    timeout: 2000,
                    icon: "fa fa-bell swing animated"
                });
                $('.config_result').show();
                $('.config_result_busy').hide();
            }
        });
    });


});

function getmaildetails() {
    $.ajax({
        url: "../appconfig/getmailconfig",
        type: "POST",
        cache: false,
        dataType: 'json',
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#new_smtpserver').val(data.SmtpHost);
            $('#new_smtpport').val(data.SmtpPort);
            $('#new_imapserver').val(data.ImapHost);
            $('#new_imapport').val(data.ImapPort);
            $('#new_username').val(data.MailBoxUser);
            $('#new_password').val(data.MailBoxPassword);
        },
        error: function (err) {
            $('#new_smtpserver').val('');
            $('#new_smtpport').val('');
            $('#new_imapserver').val('');
            $('#new_imapport').val('');
            $('#new_username').val('');
            $('#new_password').val('');
        }
    });
}

function getresultconfig() {
    $.ajax({
        url: "../appconfig/getresultconfig",
        type: "GET",
        cache: false,
        dataType: 'json',
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#ConfidenceThreshold').attr('currentstart', data[0]);
            $('#ConfidenceThreshold').attr('currentend', data[1]);
            activatesilders($('#ConfidenceThreshold'));
        },
        error: function (err) {
        }
    });
}