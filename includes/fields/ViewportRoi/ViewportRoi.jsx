import React, { Component } from 'react';
import * as PMA from '@pathomation/pma.ui';

const servers = [
    {
        serverUrl: window.PmaCoreConfiguration.serverUrl,
        sessionId: window.PmaCoreConfiguration.sessionId,
    },
];

class ViewportRoi extends Component {
    constructor(props) {
        super(props);
        this.viewerRef = React.createRef(null);
        var conf;
        try {
            conf = JSON.parse(this.props.value);
        }
        catch (e) {
            conf = {};
        }
        this.state = {
            context: null,
            slideLoader: null,
            annotationsManager: null,
            roi: conf.roi || "",
            geometry: conf.geometry || "",
            channels: conf.channels || [],
            layer: conf.layer || -1,
            timeFrame: conf.timeFrame || -1,
        };
        this.selectRoi = this.selectRoi.bind(this);
        this.removeRoi = this.removeRoi.bind(this);
        this.setViewportState = this.setViewportState.bind(this);
    }

    static slug = 'pmawp_viewport_roi';

    componentWillUnmount() {
        var conf = {
            roi: this.state.roi,
            geometry: this.state.geometry,
            channels: this.state.channels,
            layer: this.state.layer,
            timeFrame: this.state.timeFrame,
        }
        this.props._onChange(this.props.name, JSON.stringify(conf));
    }

    componentDidMount() {
        if (servers.length > 0) {
            var context = new PMA.Context({ caller: "PMA.wordpress", });
            new PMA.SessionLogin(context, servers);

            this.setState({
                context: context
            });

            setTimeout(() => this.bindViewerToDomNode());
        }
    }

    bindViewerToDomNode() {
        let slideLoader = new PMA.SlideLoader(this.state.context, {
            element: this.viewerRef.current,
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
            theme: PMA.Themes.Default,
            keyboardPanFactor: 0.5,
        });

        this.setState({
            slideLoader: slideLoader,
        })

        setTimeout(() => slideLoader.load(
            servers[0].serverUrl,
            this.props.moduleSettings.slide,
            function () {
                slideLoader.mainViewport.showAnnotationsLabels(false, false);
                let annotationsManager = new PMA.Annotations({
                    context: this.state.context,
                    element: null,
                    viewport: slideLoader.mainViewport,
                    serverUrl: servers[0].serverUrl,
                    path: this.props.moduleSettings.slide,
                    enabled: true,
                });

                annotationsManager.replaceAnnotations([]);

                if (this.state.roi !== "" && this.state.geometry !== "") {
                    var annot = {
                        LayerID: 1,
                        Geometry: this.state.geometry,
                        Color: "rgba(0,0,256,1.0)",
                        fillColor: "rgba(0,0,0,0.0)",
                        LineThickness: 1,
                    };

                    annotationsManager.addAnnotation(annot);
                }

                this.setState({
                    annotationsManager: annotationsManager,
                });
            }.bind(this)
        ));
    }

    selectRoi(ev) {
        ev.preventDefault();
        this.state.annotationsManager.startDrawing({
            type: "Rectangle",
            color: "rgba(0,0,256,1.0)",
            fillColor: "rgba(0,0,0,0.0)",
            penWidth: 1,
        });

        this.state.annotationsManager.listen(PMA.ComponentEvents.AnnotationAdded,
            function (val) {
                this.setState({
                    roi: val.feature.getGeometry().getExtent().join(","),
                    geometry: val.feature.metaData.Geometry,
                });
            }.bind(this)
        )
    }

    removeRoi(ev) {
        ev.preventDefault();
        this.state.annotationsManager.replaceAnnotations([]);
        this.setState({
            roi: "",
            geometry: "",
        });
    }

    setViewportState(ev) {
        ev.preventDefault();
        var vp = this.state.slideLoader.mainViewport;
        var channels = vp.getActiveChannels();
        var layer = vp.getActiveLayer();
        var timeFrame = vp.getActiveTimeFrame();

        this.setState({
            channels: channels,
            layer: layer,
            timeFrame: timeFrame,
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.selectRoi} disabled={this.state.roi !== ""}>Select roi</button>
                <button onClick={this.removeRoi} disabled={this.state.roi === ""}>Remove roi</button>
                <button onClick={this.setViewportState}>Set viewport state</button>
                <div id="currentviewer" ref={this.viewerRef} style={{ height: "500px" }}></div>
            </div>
        );
    }
}

export default ViewportRoi;