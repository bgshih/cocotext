import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  navigationBar: {
    marginBottom: 10,
  },
  input: {
    // width: 200,
    fontSize: 13,
  },
  button: {
    fontSize: 13,
    marginLeft: 5,
    marginRight: 5,
  }
});

class DatasetNavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goToIndex: 1,
    }
  }

  render() {
    const { goToIndex } = this.state;
    const { classes, imageIndex, numberOfImages, showAnnotations, handleSetShowAnnotations,
            handleGoToPreviousImage, handleGoToNextImage, handleGoToIndex } = this.props;

    return (
      <div className={classes.navigationBar}>
        <span>
          {(imageIndex+1).toString() + "/" + numberOfImages.toString()}
        </span>

        <Button
          className={classes.button}
          onClick={handleGoToPreviousImage}
          color="primary">
          Previous
        </Button>

        <Button
          className={classes.button}
          onClick={handleGoToNextImage}
          color="primary">
          Next
        </Button>

        <Input
          className={classes.input}
          onChange={(e) => {
            const inputStr = e.target.value;
            if (!isNaN(inputStr)) {
              this.setState({
                goToIndex: parseInt(inputStr, 10),
              });
            }
          }}/>

        <Button
          className={classes.button}
          value={goToIndex}
          onClick={() => {
            console.log('Go to ' + (goToIndex - 1).toString())
            handleGoToIndex(goToIndex - 1);
          }}
          color="secondary">
          Go
        </Button>

        <Switch
          checked={showAnnotations}
          onChange={(e) => {handleSetShowAnnotations(e.target.checked)}} />
        <span>Show Annotations</span>
      </div>
    )
  }
}

DatasetNavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
  imageIndex: PropTypes.number.isRequired,
  numberOfImages: PropTypes.number.isRequired,
  handleGoToPreviousImage: PropTypes.func.isRequired,
  handleGoToNextImage: PropTypes.func.isRequired,
  handleGoToIndex: PropTypes.func.isRequired,
  showAnnotations: PropTypes.bool.isRequired,
  handleSetShowAnnotations: PropTypes.func.isRequired,
};

export default withStyles(styles)(DatasetNavigationBar);
