import React, { Component } from 'react';
import * as PMA from '@pathomation/pma.ui';
import './style.css';

const servers = [
    {
        serverUrl: window.PmaCoreConfiguration.serverUrl,
        sessionId: window.PmaCoreConfiguration.sessionId,
    },
];

class SlideSelector extends Component {
    constructor(props) {
        super(props);
        this.treeRef = React.createRef(null);
        this.state = { tree: null, context: null, thumbUrl: "", imageInfo: null, showImageInfo: false };
    }

    static slug = 'pmawp_slide_selector';

    getReadableFileSizeString = (fileSizeInBytes) => {
        var i = -1;
        var byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
        do {
            fileSizeInBytes = fileSizeInBytes / 1024;
            i++;
        } while (fileSizeInBytes > 1024);

        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    }

    componentDidMount() {
        if (servers.length > 0) {
            var context = new PMA.Context({ caller: "PMA.wordpress", });
            new PMA.SessionLogin(context, servers);

            this.setState({
                context: context
            });

            setTimeout(() => this.bindTreeToDomNode());
        }
    }

    componentWillUnmount() {
        if (this.state.imageInfo) {
            this.props._onChange(this.props.name, this.state.imageInfo.Filename);
        }
    }

    bindTreeToDomNode() {
        var tree = new PMA.Tree(this.state.context, {
            servers: [
                {
                    name: "My Server",
                    url: servers[0].serverUrl,
                },
            ],
            element: this.treeRef.current,
            checkboxes: false,
            autoDetectPmaStart: false,
            autoExpandNodes: true,
            preview: false,
            search: false,
        });

        tree.navigateTo("My Server/" + this.props.value);

        tree.listen(PMA.ComponentEvents.SlideSelected, args => {
            var thumbUrl = PMA.getThumbnailUrl(
                args.serverUrl,
                window.PmaCoreConfiguration.sessionId,
                args.path,
                0
            );

            this.setState({
                thumbUrl: thumbUrl
            });

            this.state.context.getImageInfo(
                args.serverUrl,
                args.path,
                (sessionId, info) => {
                    this.setState({
                        imageInfo: info,
                        showImageInfo: true,
                    });
                }
            );
        });

        this.setState({
            tree: tree
        });
    }

    render() {
        return <div className="pmaslidedialog">
            <div className="pmaslidetree" id="pmaslidetree" ref={this.treeRef}></div>
            {this.state.showImageInfo && <div className="pmaslide-sidebar">
                <div className="attachment-details">
                    <h2>Slide Details</h2>
                    <div className="attachment-info">
                        <div className="thumbnail thumbnail-image">
                            <img src={this.state.thumbUrl} alt="" />
                        </div>
                        <div className="details">
                            <div className="filename">{this.state.imageInfo.Filename}</div>
                            <div className="uploaded">{new Date(parseInt(this.state.imageInfo.LastModified.substr(6))).toDateString()}</div>
                            <div className="file-size">{this.getReadableFileSizeString(this.state.imageInfo.PhysicalSize)}</div>
                            <div className="dimensions">{this.state.imageInfo.Width + " by " + this.state.imageInfo.Height + " pixels"}</div>
                            <div className="compat-meta">{"Assosiated Images: " + this.state.imageInfo.AssociatedImageTypes.toString()}</div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    }
}

export default SlideSelector;
