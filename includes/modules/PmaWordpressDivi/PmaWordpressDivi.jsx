import React, { Component, Fragment } from 'react';
import * as PMA from '@pathomation/pma.ui';
import './style.css';

const servers = [
    {
        serverUrl: window.PmaCoreConfiguration.serverUrl,
        sessionId: window.PmaCoreConfiguration.sessionId,
    },
];

class PmaWordpressDivi extends Component {
    constructor(props) {
        super(props);
        this.viewportRef = React.createRef(null);
        this.context = null;
        this.viewport = null;
    }
    static slug = 'simp_pathomation_slide';

    componentDidMount() {
    }

    componentDidUpdate() {
        if (this.props.slide == null) return;
        this.context = new PMA.Context({ caller: "PMA.wordpress", });
        new PMA.SessionLogin(this.context, servers);
        var options = this.props.viewport_options ? this.props.viewport_options.split("|") : [];
        var barcode = options.length > 1 ? options[0] === "on" : false;
        var filename = options.length > 1 ? options[1] === "on" : false;
        var overview = options.length > 1 ? options[2] === "on" : false;
        var adjustments = options.length > 1 ? options[3] === "on" : false;
        this.viewport = new PMA.SlideLoader(this.context, {
            element: this.viewportRef.current,
            overview: overview,
            dimensions: adjustments,
            snapshot: true,
            filename: filename,
            scaleLine: true,
            annotations: {
                labels: true,
                alwaysDisplayInMicrons: true,
            },
            annotationsLayers: { collapsed: true },
            digitalZoomLevels: 2,
            loadingBar: true,
            highQuality: true,
            barcode: barcode,
            colorAdjustments: false,
            zoomSlider: true,
            theme: PMA.Themes.Default,
            keyboardPanFactor: 0.5,
        });
        this.viewport.load(servers[0].serverUrl, this.props.slide);
    }

    render() {
        return (
            <Fragment>
                <h1 className="simp-pmawordpress-heading">{this.props.heading}</h1>
                <div id="viewer">
                    {this.props.slide == null ? "No slide selected." : <div ref={this.viewportRef} style={{ height: (this.props.viewport_height && this.props.viewport_height !== "0") ? this.props.viewport_height : "500px", width: (this.props.viewport_width && this.props.viewport_width !== "0") ? this.props.viewport_width : "" }}></div>}
                </div>
            </Fragment>
        );
    }
}

export default PmaWordpressDivi;
