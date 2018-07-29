import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormControl, Input, InputLabel, Select, MenuItem, Button } from '@material-ui/core';


const styles = theme => ({
  heading: {
    fontSize: 13,
    flexBasis: '50%',
    flexShrink: 0,
    marginRight: 10,
  },
  secondaryHeading: {
    // fontSize: theme.typography.pxToRem(20),
    fontSize: 13,
    color: theme.palette.text.secondary,
    textOverflow: "ellipsis",
    overflow: "hidden",
    width: "50%"
  },
  button: {
    fontSize: 13,
  },
  textField: {
    width: 200,
    fontSize: 13,
  },
  form: {
    width: 250,
    marginLeft: 10,
    marginBottom: 20,
  },
});

class TextInstanceExpansionPanel extends Component {

  constructor(props) {
    super(props);

    const annotationJson = JSON.stringify(props.annotation);
    const annotationCopy = JSON.parse(annotationJson);
    this.state = {
      correctMode: false,
      annotationCopy: annotationCopy,
    }
  }

  cancelCorrection() {
    const originalAnnotation = JSON.parse(JSON.stringify(this.props.annotation));
    this.setState({
      annotationCopy: originalAnnotation,
      correctMode: false,
    });
  }

  submitCorrections() {
    const { annotationCopy } = this.state;
    fetch('/corrections/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annotationCopy)
    })
    .then(() => {
      this.setState({
        correctMode: false,
      })
    })
    .catch((error) => {
      console.log(error)
    });
  }

  render() {
    const { classes, expanded, panelId, handleSetFocusIndex } = this.props;
    const { correctMode } = this.state;
    const { instance_id, text, legibility, language, type } = this.state.annotationCopy;
    const textDisplay = (legibility === 0 && language === 0) ? ('"' + text + '"') : "-";

    return (
      <div>
        <ExpansionPanel
          expanded={expanded}
          onChange={ () => {
            const newFocusIndex = expanded ? -1 : panelId;
            handleSetFocusIndex(newFocusIndex);
          } }>

          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{ "Instance " + instance_id }</Typography>
            <Typography className={classes.secondaryHeading}>{ textDisplay }</Typography>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <div>
              <FormControl className={classes.form}>
                <InputLabel className={classes.textField} shrink={true}>Text</InputLabel>
                <Input
                  className={classes.textField}
                  value={text}
                  disabled={!correctMode}
                  onChange={(e) => {
                    const newAnnotationCopy = update(this.state.annotationCopy, {
                      text: {$set: e.target.value},
                    });
                    this.setState({annotationCopy: newAnnotationCopy});
                  }}
                />
              </FormControl>

              <FormControl className={classes.form}>
                <InputLabel className={classes.textField} shrink={true}>Legibility</InputLabel>
                <Select
                  className={classes.textField}
                  value={legibility}
                  disabled={!correctMode}
                  onChange={(e) => {
                    const newAnnotationCopy = update(this.state.annotationCopy, {
                      legibility: {$set: e.target.value},
                    });
                    this.setState({annotationCopy: newAnnotationCopy});
                  }}
                >
                  <MenuItem className={classes.textField} value={0}>Legible</MenuItem>
                  <MenuItem className={classes.textField} value={1}>Illegible</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.form}>
                <InputLabel className={classes.textField}>Type</InputLabel>
                <Select
                  className={classes.textField}
                  value={type}
                  disabled={!correctMode}
                  onChange={(e) => {
                    const newAnnotationCopy = update(this.state.annotationCopy, {
                      type: {$set: e.target.value},
                    });
                    this.setState({annotationCopy: newAnnotationCopy});
                  }}
                >
                  <MenuItem className={classes.textField} value={0}>Machine Printed</MenuItem>
                  <MenuItem className={classes.textField} value={1}>Handwritten</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={classes.form}>
                <InputLabel className={classes.textField}>Language</InputLabel>
                <Select
                  className={classes.textField}
                  value={language}
                  disabled={!correctMode}
                  onChange={(e) => {
                    const newAnnotationCopy = update(this.state.annotationCopy, {
                      language: {$set: e.target.value},
                    });
                    this.setState({annotationCopy: newAnnotationCopy});
                  }}
                >
                  <MenuItem className={classes.textField} value={0}>English</MenuItem>
                  <MenuItem className={classes.textField} value={1}>non-English</MenuItem>
                </Select>
              </FormControl>

              {/* <Button
                className={classes.button}
                color="primary"
                onClick={() => {
                  this.setState({correctMode: true})
                }}>
                Correct
              </Button>

              {correctMode &&
                <Button
                  className={classes.button}
                  color="secondary"
                  onClick={() => {this.submitCorrections();}}>
                  Submit
                </Button>
              }
              {correctMode &&
                <Button
                  className={classes.button}
                  color="secondary"
                  onClick={() => {this.cancelCorrection();}}>
                  Cancel
                </Button>
              } */}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

TextInstanceExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  panelId: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
  handleSetFocusIndex: PropTypes.func.isRequired,
  annotation: PropTypes.shape({
    instance_id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    legibility: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    language: PropTypes.number.isRequired,
  }),
};

export default withStyles(styles)(TextInstanceExpansionPanel);
