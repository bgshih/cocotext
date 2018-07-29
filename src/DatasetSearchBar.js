import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Button } from '@material-ui/core';


const styles = theme => ({
  searchBar: {
    marginBottom: 10
  },
  textLabel: {
    fontSize: 13,
  },
  textField: {
    // width: 200,
    fontSize: 13,
  },
  button: {
    fontSize: 13
  }
});

class DatasetSearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      localImageId: null
    }
  }

  render() {
    const { localImageId } = this.state;
    const { classes, handleReloadButtonClicked } = this.props;

    return (
      <div className={ classes.searchBar }>
        <FormControl>
          <InputLabel className={ classes.textLabel }>
            Image ID
          </InputLabel>
          <Input
            value={ localImageId }
            onChange={
              (e) => { this.setState({localImageId: parseInt(e.target.value, 10)}) }
            }
            className={ classes.textField }
          />
        </FormControl>
        <Button
          className={ classes.button }
          onClick={ () => { handleReloadButtonClicked(localImageId); } }>
          Reload
        </Button>
        <Button className={ classes.button }>
          Random
        </Button>

      </div>
    );
  }
}

DatasetSearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  imageId: PropTypes.number.isRequired,
  handleReloadButtonClicked: PropTypes.func.isRequired
};


export default withStyles(styles)(DatasetSearchBar);
