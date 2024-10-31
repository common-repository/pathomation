(function ($) {
    var el = wp.element.createElement;
    var registerBlockType = wp.blocks.registerBlockType;
    var InspectorControls = wp.blockEditor ? wp.blockEditor.InspectorControls : wp.editor.InspectorControls;

    /**
     * Register block
     *
     * @param  {string}   name     Block name.
     * @param  {Object}   settings Block settings.
     * @return {?WPBlock}          Block itself, if registered successfully,
     *                             otherwise "undefined".
     */
    registerBlockType("pma-wordpress/pathomation-slide", {
        title: "Pathomation Slide",
        icon: "format-image",
        category: "common",
        description: "A custom block to add Pathomation slide to your page",
        keywords: ["image", "slide", "pathomation"],
        attributes: {
            mediaURL: {
                type: "string",
            },
            mediaTitle: {
                type: "string",
                selector: "h3",
            },
            mediaCode: {
                type: "string",
            },
            text: {
                type: "text",
                selector: "p",
            },
            image: {
                type: "image",
                selector: "img",
            },
            blockId: {
                type: "string",
            },
            path: {
                type: "string",
            },
            showBarcode: {
                type: "boolean",
            },
            showFilename: {
                type: "boolean",
            },
            showOverview: {
                type: "boolean",
            },
            showImageAdjustmentsControl: {
                type: "boolean",
            },
            viewportWidth: {
                type: "string",
            },
            viewportHeight: {
                type: "string",
            },
            viewportRoi: {
                type: "string",
            },
            viewportRoiGeometry: {
                type: "string",
            },
            viewportChannels: {
                type: "string",
            },
            viewportLayer: {
                type: "string",
            },
            viewportTimeframe: {
                type: "string",
            },
        },
        // Defines the block within the editor.
        edit: function (props) {
            var attributes = props.attributes;

            if (!attributes.blockId) {
                props.setAttributes({
                    blockId: "_" + Math.random().toString(36).substr(2, 9),
                });
            }

            var showDialog = function () {
                $("#pmaslidedialog").attr("data-id", attributes.blockId);
                $("#pmaslidedialog").attr("data-url", attributes.path);
                $("#pmaslidedialog").attr("data-barcode", attributes.showBarcode);
                $("#pmaslidedialog").attr("data-filename", attributes.showFilename);
                $("#pmaslidedialog").attr("data-overview", attributes.showOverview);
                $("#pmaslidedialog").attr("data-adjustments", attributes.showImageAdjustmentsControl);
                $("#pmaslidedialog").attr("data-width", attributes.viewportWidth);
                $("#pmaslidedialog").attr("data-height", attributes.viewportHeight);
                $("#pmaslidedialog").attr("data-roi", attributes.viewportRoi);
                $("#pmaslidedialog").attr("data-geometry", attributes.viewportRoiGeometry);
                $("#pmaslidedialog").attr("data-channels", attributes.viewportChannels);
                $("#pmaslidedialog").attr("data-layer", attributes.viewportLayer);
                $("#pmaslidedialog").attr("data-timeframe", attributes.viewportTimeframe);
                try {
                    $("#pmaslidedialog").dialog("open");
                    $("#pmaslidedialog").trigger("showDialog");
                }
                catch
                {
                    alert("Please check Pathomation plugin settings and try again.");
                }
            };

            $("#pmaslidedialog").on("changeData", function (e) {
                var path = $("#pmaslidedialog").attr("data-url");
                var blockId = $("#pmaslidedialog").attr("data-id");
                var thumb = $("#pmaslidedialog").attr("data-src");
                var showBarcode = $("#pmaslidedialog").attr("data-barcode");
                var showFilename = $("#pmaslidedialog").attr("data-filename");
                var showOverview = $("#pmaslidedialog").attr("data-overview");
                var showImageAdjustmentsControl = $("#pmaslidedialog").attr("data-adjustments");
                var viewportWidth = $("#pmaslidedialog").attr("data-width");
                var viewportHeight = $("#pmaslidedialog").attr("data-height");
                var viewportRoi = $("#pmaslidedialog").attr("data-roi");
                var viewportRoiGeometry = $("#pmaslidedialog").attr("data-geometry");
                var viewportChannels = $("#pmaslidedialog").attr("data-channels");
                var viewportLayer = $("#pmaslidedialog").attr("data-layer");
                var viewportTimeframe = $("#pmaslidedialog").attr("data-timeframe");

                if (blockId === attributes.blockId) {
                    let filename = path.split("/").pop();
                    filename = filename.substr(0, filename.lastIndexOf("."));
                    filename += ".jpg";
                    $.ajax({
                        url: PmaSettings.ajax_url,
                        type: "POST",
                        data: {
                            action: "thumbnail_upload",
                            filename: filename,
                            img: thumb,
                        },
                        success: function (response) {
                            props.setAttributes({
                                mediaCode: '[pmaslide path="' + path + '" width="' + viewportWidth + '" height="' + viewportHeight + '" barcode="' + showBarcode + '" filename="' + showFilename + '" overview="' + showOverview + '" adjustments="' + showImageAdjustmentsControl + '" roi="' + viewportRoi + '" channels="' + viewportChannels + '" layer="' + viewportLayer + '" timeframe="' + viewportTimeframe + '"]',
                                mediaURL: response,
                                mediaTitle: path.split("/").pop(),
                                path: path,
                                showBarcode: showBarcode === 'true',
                                showFilename: showFilename === 'true',
                                showOverview: showOverview === 'true',
                                showImageAdjustmentsControl: showImageAdjustmentsControl === 'true',
                                viewportWidth: viewportWidth,
                                viewportHeight: viewportHeight,
                                viewportRoi: viewportRoi,
                                viewportRoiGeometry: viewportRoiGeometry,
                                viewportChannels: viewportChannels,
                                viewportLayer: viewportLayer,
                                viewportTimeframe: viewportTimeframe,
                            });
                            $("#pmaslidedialog").trigger("clearData");
                        },
                    });
                }
            });

            return [
                el(
                    InspectorControls,
                    { key: "inspector" },
                    el(
                        wp.components.PanelBody,
                        {
                            title: "Slide options",
                            className: "block-content",
                            initialOpen: true,
                        },
                        el(wp.components.PanelRow, {},
                            el(wp.components.Card,
                                {
                                    isBorderless: true,
                                    size: "small",
                                    style: { width: "100%" },
                                },
                                el(wp.components.CardHeader,
                                    {
                                        isBorderless: true,
                                        isShady: true,
                                        style: { fontWeight: 600, justifyContent: "center" }
                                    },
                                    attributes.mediaTitle ? props.attributes.mediaTitle : "No slide selected."
                                ),
                                el(wp.components.CardMedia, {},
                                    el("img", { src: attributes.mediaURL }),
                                ),
                                el(wp.components.CardHeader,
                                    {
                                        isBorderless: true,
                                        style: { justifyContent: "center" }
                                    },
                                    !attributes.mediaCode
                                        ? el(
                                            wp.components.Button,
                                            {
                                                className: "button button-large",
                                                onClick: showDialog,
                                            },
                                            "Add Slide"
                                        )
                                        :
                                        el(
                                            wp.components.Button,
                                            {
                                                className: "button button-large",
                                                onClick: showDialog,
                                                // onClick: () => {
                                                //     props.setAttributes({
                                                //         mediaCode: "",
                                                //         mediaURL: "",
                                                //         mediaTitle: "",
                                                //         path: "",
                                                //         showBarcode: false,
                                                //         showFilename: false,
                                                //         showOverview: false,
                                                //         showImageAdjustmentsControl: false,
                                                //         viewportWidth: "",
                                                //         viewportHeight: "",
                                                //         viewportRoi: "",
                                                //     });
                                                // },
                                            },
                                            "Change Slide/ROI"
                                        )
                                ),
                            ),
                        )
                    ),
                    el(
                        wp.components.PanelBody,
                        {
                            title: "Viewport options",
                            className: "block-content",
                            initialOpen: true,
                        },
                        el(wp.components.PanelRow, {},
                            el(wp.components.CheckboxControl,
                                {
                                    label: 'Show barcode',
                                    onChange: (value) => {
                                        props.setAttributes({
                                            mediaCode: '[pmaslide path="' + props.attributes.path + '" width="' + props.attributes.viewportWidth + '" height="' + props.attributes.viewportHeight + '" barcode="' + value + '" filename="' + props.attributes.showFilename + '" overview="' + props.attributes.showOverview + '" adjustments="' + props.attributes.showImageAdjustmentsControl + '" roi="' + props.attributes.viewportRoi + '" channels="' + props.attributes.viewportChannels + '" layer="' + props.attributes.viewportLayer + '" timeframe="' + props.attributes.viewportTimeframe + '"]',
                                            showBarcode: value
                                        });
                                    },
                                    checked: props.attributes.showBarcode,
                                }
                            )
                        ),
                        el(wp.components.PanelRow, {},
                            el(wp.components.CheckboxControl,
                                {
                                    label: 'Show filename',
                                    onChange: (value) => {
                                        props.setAttributes({
                                            mediaCode: '[pmaslide path="' + props.attributes.path + '" width="' + props.attributes.viewportWidth + '" height="' + props.attributes.viewportHeight + '" barcode="' + props.attributes.showBarcode + '" filename="' + value + '" overview="' + props.attributes.showOverview + '" adjustments="' + props.attributes.showImageAdjustmentsControl + '" roi="' + props.attributes.viewportRoi + '" channels="' + props.attributes.viewportChannels + '" layer="' + props.attributes.viewportLayer + '" timeframe="' + props.attributes.viewportTimeframe + '"]',
                                            showFilename: value
                                        });
                                    },
                                    checked: props.attributes.showFilename,
                                }
                            )
                        ),
                        el(wp.components.PanelRow, {},
                            el(wp.components.CheckboxControl,
                                {
                                    label: 'Show overview',
                                    onChange: (value) => {
                                        props.setAttributes({
                                            mediaCode: '[pmaslide path="' + props.attributes.path + '" width="' + props.attributes.viewportWidth + '" height="' + props.attributes.viewportHeight + '" barcode="' + props.attributes.showBarcode + '" filename="' + props.attributes.showFilename + '" overview="' + value + '" adjustments="' + props.attributes.showImageAdjustmentsControl + '" roi="' + props.attributes.viewportRoi + '" channels="' + props.attributes.viewportChannels + '" layer="' + props.attributes.viewportLayer + '" timeframe="' + props.attributes.viewportTimeframe + '"]',
                                            showOverview: value
                                        });
                                    },
                                    checked: props.attributes.showOverview,
                                }
                            )
                        ),
                        el(wp.components.PanelRow, {},
                            el(wp.components.CheckboxControl,
                                {
                                    label: 'Show image adjustments control',
                                    onChange: (value) => {
                                        props.setAttributes({
                                            mediaCode: '[pmaslide path="' + props.attributes.path + '" width="' + props.attributes.viewportWidth + '" height="' + props.attributes.viewportHeight + '" barcode="' + props.attributes.showBarcode + '" filename="' + props.attributes.showFilename + '" overview="' + props.attributes.showOverview + '" adjustments="' + value + '" roi="' + props.attributes.viewportRoi + '" channels="' + props.attributes.viewportChannels + '" layer="' + props.attributes.viewportLayer + '" timeframe="' + props.attributes.viewportTimeframe + '"]',
                                            showImageAdjustmentsControl: value
                                        });
                                    },
                                    checked: props.attributes.showImageAdjustmentsControl,
                                }
                            )
                        ),
                    ),
                    el(
                        wp.components.PanelBody,
                        {
                            title: "Viewport dimensions",
                            className: "block-content",
                            initialOpen: true,
                        },
                        el(wp.components.PanelRow, {},
                            el(wp.components.__experimentalNumberControl,
                                {
                                    label: 'Viewport width',
                                    onChange: (value) => {
                                        props.setAttributes({
                                            mediaCode: '[pmaslide path="' + props.attributes.path + '" width="' + value + '" height="' + props.attributes.viewportHeight + '" barcode="' + props.attributes.showBarcode + '" filename="' + props.attributes.showFilename + '" overview="' + props.attributes.showOverview + '" adjustments="' + props.attributes.showImageAdjustmentsControl + '" roi="' + props.attributes.viewportRoi + '" channels="' + props.attributes.viewportChannels + '" layer="' + props.attributes.viewportLayer + '" timeframe="' + props.attributes.viewportTimeframe + '"]',
                                            viewportWidth: value
                                        });
                                    },
                                    value: props.attributes.viewportWidth,
                                    min: 0,
                                }
                            )
                        ),
                        el(wp.components.PanelRow, {},
                            el(wp.components.__experimentalNumberControl,
                                {
                                    label: 'Viewport height',
                                    onChange: (value) => {
                                        props.setAttributes({
                                            mediaCode: '[pmaslide path="' + props.attributes.path + '" width="' + props.attributes.viewportWidth + '" height="' + value + '" barcode="' + props.attributes.showBarcode + '" filename="' + props.attributes.showFilename + '" overview="' + props.attributes.showOverview + '" adjustments="' + props.attributes.showImageAdjustmentsControl + '" roi="' + props.attributes.viewportRoi + '" channels="' + props.attributes.viewportChannels + '" layer="' + props.attributes.viewportLayer + '" timeframe="' + props.attributes.viewportTimeframe + '"]',
                                            viewportHeight: value
                                        });
                                    },
                                    value: props.attributes.viewportHeight,
                                    min: 0,
                                }
                            )
                        ),
                    ),
                    // el(
                    //     wp.components.PanelBody,
                    //     {
                    //         title: "Viewport roi",
                    //         className: "block-content",
                    //         initialOpen: true,
                    //     },
                    //     el(wp.components.PanelRow, {},
                    //         el(wp.components.__experimentalGrid,
                    //             {
                    //                 label: 'Viewport ROI',
                    //                 columns: 2,
                    //             },
                    //             el(wp.components.TextControl, { label: "x0y0", value: props.attributes.viewportRoi ? props.attributes.viewportRoi.split(",")[0] || "" : "" }),
                    //             el(wp.components.TextControl, { label: "x1y0", value: props.attributes.viewportRoi ? props.attributes.viewportRoi.split(",")[1] || "" : "" }),
                    //             el(wp.components.TextControl, { label: "x0y1", value: props.attributes.viewportRoi ? props.attributes.viewportRoi.split(",")[2] || "" : "" }),
                    //             el(wp.components.TextControl, { label: "x1y1", value: props.attributes.viewportRoi ? props.attributes.viewportRoi.split(",")[3] || "" : "" }),
                    //         )
                    //     ),
                    // )
                ),
                el(
                    "div",
                    {
                        className: "my-block-content",
                        key: "content",
                    },
                    props.attributes.mediaCode
                        ? props.attributes.mediaCode
                        : "No slide selected."
                ),
            ];
        },

        // Defines the saved block.
        save: function (props) {
            return el(
                "div",
                {
                    className: "my-block-content",
                },
                props.attributes.mediaCode
                    ? props.attributes.mediaCode
                    : "No slide selected."
            );
        },
    });
})(jQuery);
