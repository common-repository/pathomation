(function ($) {
    "use strict";

    $(document).ready(function () {
        $("#submit.pma").prop("disabled", true);

        $("#pmacore_url").on("focus", function () {
            $("#submit.pma").prop("disabled", true);
            $("#connectionInfo").empty();
        });

        $("#pmacore_username").on("focus", function () {
            $("#submit.pma").prop("disabled", true);
            $("#connectionInfo").empty();
        });

        $("#pmacore_password").on("focus", function () {
            $("#submit.pma").prop("disabled", true);
            $("#connectionInfo").empty();
        });

        $("#mypathomation_username").on("focus", function () {
            $("#submit.pma").prop("disabled", true);
            $("#connectionInfo").empty();
        });

        $("#mypathomation_password").on("focus", function () {
            $("#submit.pma").prop("disabled", true);
            $("#connectionInfo").empty();
        });

        if ($("#mypathomation_radio").is(":checked")) {
            $("#mypathomation_section").removeClass("hidden");
            $("#pmacore_section").addClass("hidden");
            $("#connection_method").val($("#mypathomation_radio").val());
        }
        if ($("#pmacore_radio").is(":checked")) {
            $("#pmacore_section").removeClass("hidden");
            $("#mypathomation_section").addClass("hidden");
            $("#connection_method").val($("#pmacore_radio").val());
        }

        $('input[type="radio"]').on("change", function (e) {
            if (e.target.value === "mypathomation") {
                $("#mypathomation_section").removeClass("hidden");
                $("#pmacore_section").addClass("hidden");
            }
            if (e.target.value === "pmacore") {
                $("#pmacore_section").removeClass("hidden");
                $("#mypathomation_section").addClass("hidden");
            }
            $("#connection_method").val(e.target.value);
            $("#submit.pma").prop("disabled", true);
            $("#connectionInfo").empty();
        });

        $("#testButton").on("click", function () {
            $("#connectionInfo").empty();
            $("#testButton").prop("disabled", true);
            $(".spinner").addClass("is-active");
            $("#submit.pma").prop("disabled", true);
            let connection = $("#connection_method").val();
            let url = connection === "pmacore" ? $("#pmacore_url").val() : "";
            let username =
                connection === "pmacore"
                    ? $("#pmacore_username").val()
                    : $("#mypathomation_username").val();
            let password =
                connection === "pmacore"
                    ? $("#pmacore_password").val()
                    : $("#mypathomation_password").val();

            $.ajax({
                url: PmaSettings.ajax_url,
                type: "POST",
                accept: "application/json",
                data: {
                    action: "test_connection",
                    url: url,
                    username: username,
                    password: password,
                    connection: connection,
                },
            }).then(function (response) {
                if (response.status === "success") {
                    $("#connectionInfo").html(
                        '<p class="notice notice-success">' +
                        response.statusText +
                        "</p>"
                    );
                    $("#submit.pma").prop("disabled", false);
                } else {
                    let output = "";
                    output +=
                        '<p class="notice notice-error">' + response.statusText;
                    let arr = response.result;
                    $.each(arr, function (index, value) {
                        output += "</br>" + value;
                    });
                    output += "</p>";
                    $("#connectionInfo").html(output);
                }
                $("#testButton").prop("disabled", false);
                $(".spinner").removeClass("is-active");
            });
        });
    });
})(jQuery);
