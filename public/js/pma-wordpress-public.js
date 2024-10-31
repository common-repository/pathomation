(function ($) {
    "use strict";
    $(function () {
        var context = new PMA.UI.Components.Context({
            caller: "demo",
        });

        var servers = [
            {
                serverUrl: PmaCoreConfiguration.serverUrl,
                sessionId: PmaCoreConfiguration.sessionId,
            },
        ];

        console.info(`PMA.UI version: ${PMA.UI.getVersion()}`)

        new PMA.UI.Authentication.SessionLogin(context, servers);

        lozad('.pmaslide.viewer', {
            load: function (el) {
                var slideLoader = new PMA.UI.Components.SlideLoader(context, {
                    element: el,
                    overview: $(el).data("overview"),
                    dimensions: $(el).data("adjustments"),
                    snapshot: true,
                    filename: $(el).data("filename"),
                    scaleLine: true,
                    annotations: {
                        labels: true,
                        alwaysDisplayInMicrons: true,
                    },
                    annotationsLayers: { collapsed: true },
                    digitalZoomLevels: 2,
                    loadingBar: true,
                    highQuality: true,
                    barcode: $(el).data("barcode"),
                    colorAdjustments: false,
                    zoomSlider: true,
                    theme: PMA.UI.View.Themes.Default,
                    keyboardPanFactor: 0.5,
                });

                slideLoader.load(
                    PmaCoreConfiguration.serverUrl,
                    $(el).data("path"),
                    function () {
                        var vp = slideLoader.mainViewport;
                        vp.setActiveChannels($(el).data("channels") || [0]);
                        vp.setActiveLayer($(el).data("layer"));
                        vp.setActiveTimeFrame($(el).data("timeframe"));
                    }.bind(el)
                );

                var extent = $(el).data("roi").split(",");

                slideLoader.listen("SlideLoaded", function () {
                    if (extent.length > 1) {
                        slideLoader.mainViewport.fitToExtent(extent.map(x => { return parseFloat(x) }), false);
                    }
                });

                slideLoader.listen("SlideInfoError", function () {
                    $(el).css("height", "auto");
                    $(el).css("margin", "20px 0");
                });
            }
        }).observe();
    });
})(jQuery);
