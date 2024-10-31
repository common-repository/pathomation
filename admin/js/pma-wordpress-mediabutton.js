(function ($) {
    "use strict";
    var tree = null;
    var servers = [
        {
            serverUrl: PmaCoreConfiguration.serverUrl,
            sessionId: PmaCoreConfiguration.sessionId,
        },
    ];
    var slideLoader = null;

    $(document).ready(function () {
        var context = new PMA.UI.Components.Context({
            caller: "demo",
        });

        if (!PmaCoreConfiguration.serverUrl || !PmaCoreConfiguration.sessionId) {
            alert("Please check Pathomation module settings and try again.");
            return;
        }

        new PMA.UI.Authentication.SessionLogin(context, servers);

        $.ajax({
            url: PmaCoreConfiguration.ajax_url,
            type: "post",
            data: {
                action: "dialog_selector",
            },
        }).then(
            function (response) {
                $(response).appendTo("body");

                tree = new PMA.UI.Components.Tree(context, {
                    servers: [
                        {
                            name: "My Server",
                            url: PmaCoreConfiguration.serverUrl,
                        },
                    ],
                    element: ".pmaslidetree",
                    checkboxes: false,
                    autoDetectPmaStart: false,
                    autoExpandNodes: true,
                    preview: false,
                    search: false,
                });

                slideLoader = new PMA.UI.Components.SlideLoader(context, {
                    element: ".pmaslide-viewer",
                    overview: false,
                    dimensions: true,
                    snapshot: false,
                    filename: false,
                    scaleLine: true,
                    annotations: {
                        visible: true,
                        labels: false,
                    },
                    annotationsLayers: false,
                    digitalZoomLevels: 2,
                    loadingBar: true,
                    highQuality: true,
                    barcode: false,
                    colorAdjustments: false,
                    zoomSlider: true,
                    theme: PMA.UI.View.Themes.Default,
                    keyboardPanFactor: 0.5,
                });

                $("#pmaslidedialog").on("showDialog", function () {
                    tree.navigateTo("My Server/" + $("#pmaslidedialog").attr("data-url"));
                    $("#showBarcode").prop("checked", $("#pmaslidedialog").attr("data-barcode") === "true");
                    $("#showFilename").prop("checked", $("#pmaslidedialog").attr("data-filename") === "true");
                    $("#showOverview").prop("checked", $("#pmaslidedialog").attr("data-overview") === "true");
                    $("#showImageAdjustmentsControl").prop("checked", $("#pmaslidedialog").attr("data-adjustments") === "true");
                    $("#viewportWidth").val($("#pmaslidedialog").attr("data-width"));
                    $("#viewportHeight").val($("#pmaslidedialog").attr("data-height"));
                    $("#viewportRoi").val($("#pmaslidedialog").attr("data-roi"));
                    $("#viewportRoiGeometry").val($("#pmaslidedialog").attr("data-geometry"));
                    $("#viewportChannels").val($("#pmaslidedialog").attr("data-channels"));
                    $("#viewportLayer").val($("#pmaslidedialog").attr("data-layer"));
                    $("#viewportTimeframe").val($("#pmaslidedialog").attr("data-timeframe"));
                    if ($("#viewportRoi").val()) {
                        $($(".media-button-roi")[0]).css("display", "none");
                        $($(".media-button-remove-roi")[0]).css("display", "");
                    }
                });

                tree.listen(PMA.UI.Components.Events.SlideSelected, function (
                    args
                ) {
                    slideLoader.load(
                        PmaCoreConfiguration.serverUrl,
                        args.path,
                        function () {
                            slideLoader.mainViewport.setActiveChannels(($("#viewportChannels").val().split(",")) || [0]);
                            slideLoader.mainViewport.setActiveLayer($("#viewportLayer").val());
                            slideLoader.mainViewport.setActiveTimeFrame($("#viewportTimeframe").val());

                            slideLoader.mainViewport.showAnnotationsLabels(false, false);
                            let annotationsManager = new PMA.UI.Components.Annotations({
                                context: context,
                                element: null,
                                viewport: slideLoader.mainViewport,
                                serverUrl: PmaCoreConfiguration.serverUrl,
                                path: args.path,
                                enabled: true,
                            });

                            annotationsManager.replaceAnnotations([]);

                            if ($("#viewportRoi").val() !== "" && $("#viewportRoiGeometry").val() !== "") {
                                var annot = {
                                    LayerID: 1,
                                    Geometry: $("#viewportRoiGeometry").val(),
                                    Color: "rgba(0,0,256,1.0)",
                                    fillColor: "rgba(0,0,0,0.0)",
                                    LineThickness: 1,
                                };

                                annotationsManager.addAnnotation(annot);
                            }

                            $("#pmaslidedialog").on(
                                "click",
                                ".media-button-roi",
                                function () {
                                    annotationsManager.startDrawing({
                                        type: "Rectangle",
                                        color: "rgba(0,0,256,1.0)",
                                        fillColor: "rgba(0,0,0,0.0)",
                                        penWidth: 1,
                                    });

                                    annotationsManager.listen(PMA.UI.Components.Events.AnnotationAdded,
                                        function (val) {
                                            $("#viewportRoi").val(val.feature.getGeometry().getExtent());
                                            $("#viewportRoiGeometry").val(val.feature.metaData.Geometry);
                                            $($(".media-button-roi")[0]).css("display", "none");
                                            $($(".media-button-remove-roi")[0]).css("display", "");
                                        }
                                    )
                                }
                            );

                            $("#pmaslidedialog").on(
                                "click",
                                ".media-button-remove-roi",
                                function () {
                                    annotationsManager.replaceAnnotations([]);
                                    $("#viewportRoi").val("");
                                    $("#viewportRoiGeometry").val("");
                                    $($(".media-button-roi")[0]).css("display", "");
                                    $($(".media-button-remove-roi")[0]).css("display", "none");
                                }
                            );

                            $("#pmaslidedialog").on(
                                "click",
                                ".media-button-set-roi",
                                function () {
                                    var vp = slideLoader.mainViewport;
                                    var channels = vp.getActiveChannels();
                                    var layer = vp.getActiveLayer();
                                    var timeFrame = vp.getActiveTimeFrame();
                                    $("#viewportChannels").val(JSON.stringify(channels).replace("[", "").replace("]", ""));
                                    $("#viewportLayer").val(layer);
                                    $("#viewportTimeframe").val(timeFrame);
                                }
                            );
                        }
                    );

                    var thumbUrl = PMA.UI.Components.getThumbnailUrl(
                        args.serverUrl,
                        PmaCoreConfiguration.sessionId,
                        args.path,
                        0
                    );

                    context.getImageInfo(
                        args.serverUrl,
                        args.path,
                        function (sessionId, info) {
                            var d = new Date(
                                parseInt(info.LastModified.substr(6))
                            );

                            $("#pmaslidedialog .details .filename").html(
                                info.Filename
                            );
                            $("#pmaslidedialog .details .uploaded").html(
                                d.toDateString()
                            );
                            $("#pmaslidedialog .details .file-size").html(
                                getReadableFileSizeString(info.PhysicalSize)
                            );
                            $("#pmaslidedialog .details .dimensions").html(
                                info.Width + " by " + info.Height + " pixels"
                            );
                            $("#pmaslidedialog .details .compat-meta").html(
                                "Assosiated Images: " +
                                info.AssociatedImageTypes.toString()
                            );
                        },
                        function () { }
                    );

                    $("#pmaslidedialog .attachment-details").css("display", "");
                    $("#pmaslidedialog .thumbnail.thumbnail-image img").attr(
                        "src",
                        thumbUrl
                    );
                });

                $(".pmaslidetree")
                    .fancytree("getRootNode")
                    .getFirstChild()
                    .setExpanded(true);

                $("#pmaslidedialog").dialog({
                    title: "Select a slide",
                    dialogClass: "wp-dialog pmaslidedialog",
                    autoOpen: false,
                    minHeight: "620",
                    width: "80%",
                    modal: true,
                    resizable: false,
                    closeOnEscape: false,
                    position: {
                        my: "center",
                        at: "center",
                        of: window,
                    },
                    open: function () {
                        // close dialog by clicking the overlay behind it
                        // $(".ui-widget-overlay").bind("click", function () {
                        //     $("#pmaslidedialog").dialog("close");
                        // });
                    },
                    create: function () {
                        // style fix for WordPress admin
                        $(".ui-dialog-titlebar-close").addClass("ui-button");
                    },
                    beforeClose: function (event, ui) { },
                });

                $("#pmaslidedialog").on(
                    "click",
                    ".media-button-insert",
                    function () {
                        $("#pmaslidedialog").dialog("close");
                        var selection = tree.getSelectedSlide();
                        if (selection) {
                            $("#pmaslidedialog").attr(
                                "data-src",
                                $("#pmaslidedialog .thumbnail.thumbnail-image img").attr("src")
                            );
                            $("#pmaslidedialog").attr("data-url", selection.path);
                            $("#pmaslidedialog").attr("data-barcode", $("#showBarcode").prop("checked"));
                            $("#pmaslidedialog").attr("data-filename", $("#showFilename").prop("checked"));
                            $("#pmaslidedialog").attr("data-overview", $("#showOverview").prop("checked"));
                            $("#pmaslidedialog").attr("data-adjustments", $("#showImageAdjustmentsControl").prop("checked"));
                            $("#pmaslidedialog").attr("data-width", $("#viewportWidth").val());
                            $("#pmaslidedialog").attr("data-height", $("#viewportHeight").val());
                            $("#pmaslidedialog").attr("data-roi", $("#viewportRoi").val());
                            $("#pmaslidedialog").attr("data-geometry", $("#viewportRoiGeometry").val());
                            $("#pmaslidedialog").attr("data-channels", $("#viewportChannels").val());
                            $("#pmaslidedialog").attr("data-layer", $("#viewportLayer").val());
                            $("#pmaslidedialog").attr("data-timeframe", $("#viewportTimeframe").val());
                            $("#pmaslidedialog").trigger("changeData");
                        }
                    }
                );

                $(".pmaslidedialog").on(
                    "click",
                    ".ui-button.ui-dialog-titlebar-close",
                    function () {
                        $("#pmaslidedialog").attr("data-id", "");
                        $("#pmaslidedialog").attr("data-url", "");
                        $("#pmaslidedialog").attr("data-barcode", "");
                        $("#pmaslidedialog").attr("data-filename", "");
                        $("#pmaslidedialog").attr("data-overview", "");
                        $("#pmaslidedialog").attr("data-adjustments", "");
                        $("#pmaslidedialog").attr("data-width", "");
                        $("#pmaslidedialog").attr("data-height", "");
                        $("#pmaslidedialog").attr("data-roi", "");
                        $("#pmaslidedialog").attr("data-geometry", "");
                        $("#pmaslidedialog").attr("data-channels", "");
                        $("#pmaslidedialog").attr("data-layer", "");
                        $("#pmaslidedialog").attr("data-timeframe", "");
                        slideLoader.load(null, null);
                        tree.collapseAll();
                        $(".pmaslidetree").fancytree("getRootNode").getFirstChild().setExpanded(true);
                        $("#pmaslidedialog .attachment-details").css("display", "none");
                    }
                );

                $("#pmaslidedialog").on("clearData", function (e) {
                    $("#pmaslidedialog").attr("data-id", "");
                    $("#pmaslidedialog").attr("data-url", "");
                    $("#pmaslidedialog").attr("data-barcode", "");
                    $("#pmaslidedialog").attr("data-filename", "");
                    $("#pmaslidedialog").attr("data-overview", "");
                    $("#pmaslidedialog").attr("data-adjustments", "");
                    $("#pmaslidedialog").attr("data-width", "");
                    $("#pmaslidedialog").attr("data-height", "");
                    $("#pmaslidedialog").attr("data-roi", "");
                    $("#pmaslidedialog").attr("data-geometry", "");
                    $("#pmaslidedialog").attr("data-channels", "");
                    $("#pmaslidedialog").attr("data-layer", "");
                    $("#pmaslidedialog").attr("data-timeframe", "");
                    slideLoader.load(null, null);
                    tree.collapseAll();
                    $(".pmaslidetree").fancytree("getRootNode").getFirstChild().setExpanded(true);
                    $("#pmaslidedialog .attachment-details").css("display", "none");
                });
            },
            function () { }
        );
    });

    function getReadableFileSizeString(fileSizeInBytes) {
        var i = -1;
        var byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    }
})(jQuery);
