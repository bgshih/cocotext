import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

import { withStyles } from '@material-ui/core/styles';
import ImageViewer from './ImageViewer';
import ImageInfoPanel from './ImageInfoPanel';
// import DatasetSearchBar from './DatasetSearchBar';
import DatasetNavigationBar from './DatasetNavigationBar';


const styles = theme => ({
  container: {
  }
});


export class DatasetExplorer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageId: -1,
      imageIdList: [],
      imageIndex: -1,
      textInstances: null,
      focusIndex: -1,
      showAnnotations: true,
    }
  }

  componentDidMount() {
    this.fetchImageIdList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { imageId, imageIndex, imageIdList } = this.state;
    if (prevState.imageId !== imageId) {
      this.fetchAnnotations();
    }

    if (prevState.imageIndex !== imageIndex) {
      const newImageId = imageIdList[imageIndex];
      this.setState({imageId: newImageId});
    }
  }

  fetchImageIdList() {
    const imageIdListUrl = "image_list.min.json";
    fetch(imageIdListUrl)
      .then((response) => response.json())
      .then((imageListJson) => {
        let imageIdList = imageListJson['image_list_min'];
        imageIdList.sort();
        this.setState({
          imageIdList: imageIdList
        })
      })
      .then(() => {
        this.setState({
          imageIndex: 26186,
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  fetchAnnotations() {
    this.setState({
      textInstances: null,
    });
    const { imageId } = this.state;
    const annotationUrl = "v3/" + imageId.toString() + ".json";
    fetch(annotationUrl)
      .then((response) => response.json())
      .then((annotJson) => {
        // imageId may have been changed since fetch started
        if (imageId === this.state.imageId) {
          this.setState({
            textInstances: annotJson['annotations'],
          })
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // handleKeyPress(event) {
  //   const { imageIndex, focusIndex, imageIdList, textInstances } = this.state;
  //   const numberOfImages = imageIdList.length;
  //   const numberOfInstances = textInstances.length;

  //   if (numberOfImages === 0) {
  //     return;
  //   }

  //   switch(event.key) {
  //     case '{':
  //       this.setState({
  //         imageIndex: Math.max(0, imageIndex - 1)
  //       });
  //       break;
  //     case '}':
  //       this.setState({
  //         imageIndex: Math.min(numberOfImages - 1, imageIndex + 1)
  //       });
  //       break;
  //     case '[':
  //       // focusIndex can be -1 (no focus)
  //       this.setState({
  //         focusIndex: Math.max(-1, focusIndex - 1)
  //       });
  //       break;
  //     case ']':
  //       this.setState({
  //         focusIndex: Math.min(numberOfInstances - 1, focusIndex + 1)
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }

  setImageIndexById(imageId) {
    const { imageIdList } = this.state;
    const imageIndex = imageIdList.findIndex((id) => (id === imageId));
    this.setState({
      imageIndex: imageIndex
    });
  }

  render() {
    const { textInstances, focusIndex, imageId, imageIndex, showAnnotations } = this.state;
    const { classes } = this.props;
    const numberOfImages = this.state.imageIdList.length;

    return (
      <div className="DatasetExplorer">
        <Grid className={classes.container}>
          {/* <Row>
            <Col xs={12}>
              <DatasetSearchBar
                imageId={ imageId }
                handleReloadButtonClicked={
                  (value) => {
                    this.setState({imageId: value, focusIndex: -1});
                  }
                }
              />
            </Col>
          </Row> */}

          <Row>
            <Col xs={12}>
              <DatasetNavigationBar
                imageIndex={imageIndex}
                numberOfImages={numberOfImages}
                handleGoToPreviousImage={() => {
                  this.setState({
                    imageIndex: Math.max(0, imageIndex - 1),
                  });
                }}
                handleGoToNextImage={() => {
                  this.setState({
                    imageIndex: Math.min(numberOfImages - 1, imageIndex + 1),
                  });
                }}
                handleGoToIndex={(index) => {
                  this.setState({
                    imageIndex: Math.max(0, Math.min(numberOfImages - 1, index)),
                  })
                }}
                showAnnotations={showAnnotations}
                handleSetShowAnnotations={(checked) => {
                  this.setState({
                    showAnnotations: checked,
                  });
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={8} sm={12}>
              <ImageViewer
                imageId={ imageId }
                textInstances={ textInstances }
                focusIndex={ focusIndex }
                handleSetFocusIndex={
                  (index) => {
                    this.setState({focusIndex: index})
                  }
                }
                showAnnotations={showAnnotations}
              />
            </Col>

            <Col lg={4} sm={12}>
              <ImageInfoPanel
                imageId={ imageId }
                textInstances={ textInstances }
                focusIndex={ focusIndex }
                handleSetFocusIndex={
                  (index) => {
                    this.setState({focusIndex: index})
                  }
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

DatasetExplorer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DatasetExplorer);
