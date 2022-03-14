import * as React from 'react';
// import styles from './AtlasSpotlightConnect.module.scss';
import './DocModal.css';

import { IAtlasSpotlightConnectProps } from './IAtlasSpotlightConnectProps';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { SocialMediaIconsReact } from 'social-media-icons-react';

import { IoMdDownload } from "react-icons/io";


import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType, initializeFileTypeIcons } from '@fluentui/react-file-type-icons';

initializeFileTypeIcons(undefined);

export class DescriptionModal extends React.Component<any, any> {

    closeModal = e => {
        this.setState({ isOpen: false }, () => {
            if (this.props.onClose) {
                this.props.onClose(this.state);
            }
        })
    };

    constructor(props) {
        super(props);
        this.state = ({
            isOpen: true
        })
    }
    componentDidMount() {
        this.setState({
            isOpen: true
        });
        console.log(this.props.dataset[1])
    }

    public render() {

        return (
            // <h3></h3>
            <>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
                <script src='https://kit.fontawesome.com/a076d05399.js'
                    crossOrigin='anonymous'></script>
               
         

                <Modal  show={this.state.isOpen} onHide={this.closeModal} keyboard={false} size="lg">
                    <Modal.Header className={'modalHeader'} closeButton>
                        <Modal.Title>Ourbrand Documents</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{
                        // backgroundImage: "url(" + `${this.props.dataset[1]}` + ")",
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }} className={'docView'}>
                        <Container>
                            <Row
                            style={{
                                // background: "rgba(255,255,255,0.8)",
                                // borderRadius: "25px",
                                // padding: "7px",
                                // paddingTop: "20px"
                                marginRight: "-68px"
                            }}
                            >


    

                                <ul>
                                    {this.props.dataset[0].map((itemDetail, i) => (

                                        <li className={'doc'}><span className="fa fa-star-o icon-star-empty"></span>

                                            <a target="_blank" data-interception="off" rel="noopener noreferrer" href={itemDetail.ListItemAllFields.ServerRedirectedEmbedUri != null && itemDetail.ListItemAllFields.ServerRedirectedEmbedUri != "" ? itemDetail.ListItemAllFields.ServerRedirectedEmbedUri : itemDetail.ServerRelativeUrl}>
                                                <Icon {...getFileTypeIconProps({
                                                    extension: itemDetail.Name.split(".")[1],
                                                    size: 20,
                                                    imageFileType: 'svg'
                                                })} /> {itemDetail.Name}</a>
                                            <a data-interception="off" rel="noopener noreferrer" className="docDownload doc-download-link" href={"https://devbeam.sharepoint.com/sites/ModernConnect/_layouts/download.aspx?SourceUrl=" + itemDetail.ServerRelativeUrl} download> <IoMdDownload /></a>

                                        </li>

                                    ))}
                                </ul>





                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ height: "50px" }} variant="secondary" onClick={this.closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



            </>
        );
    }
}