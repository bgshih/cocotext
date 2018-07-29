import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import TextInstanceExpansionPanel from './TextInstanceExpansionPanel.js';


const styles = theme => ({
  container: {
    // maxHeight: 800,
    // overflowY: "scroll",
  },
  panelHead: {
    fontSize: 13,
    marginBottom: 5
  },
  hr: {
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    fontSize: 13,
  }
})


class ImageInfoPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageReported: false,
    }
  }

  reportImage() {
    const { imageId } = this.props;

    fetch('/corrections/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "image_id": imageId,
      })
    })
    .then(() => {
      if (imageId === this.props.imageId) {
        this.setState({
          imageReported: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { imageId } = this.props;
    if (imageId !== prevProps.imageId) {
      this.setState({imageReported: false});
    }
  }

  render() {
    const { imageReported } = this.state;
    const { classes, imageId, textInstances, focusIndex, handleSetFocusIndex } = this.props;

    if (textInstances === null) {
      return (
        <div>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      );
    }

    return (
      <div className={ classes.container }>
        <p className={ classes.panelHead }>
          Image ID: { imageId }
        </p>
        <p className={ classes.panelHead }>
          Number of instances: { textInstances.length }
        </p>
        {/* {imageReported ?
          (
            <p>Image reported</p>
          ):
          (
            <Button
              className={classes.button}
              color="secondary"
              onClick={() => {this.reportImage();}}>
              Report Image
            </Button>
          )
        } */}

        <hr className={ classes.hr } />
        {textInstances.map((instance, index) => (
          <TextInstanceExpansionPanel
            panelId={ index }
            key={ index }
            expanded={ focusIndex === index }
            handleSetFocusIndex={ handleSetFocusIndex }
            annotation={ instance }
          />
        ))}

      </div>
    );
  }
}

ImageInfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  imageId: PropTypes.number.isRequired,
  textInstances: PropTypes.arrayOf(PropTypes.shape({
    instance_id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    legibility: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    language: PropTypes.number.isRequired,
  })),
  focusIndex: PropTypes.number.isRequired,
  handleSetFocusIndex: PropTypes.func.isRequired,
};

export default withStyles(styles)(ImageInfoPanel);
