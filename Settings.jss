import React, { useState } from 'react';
import { Switch, FormControlLabel, FormGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  switch: {
    margin: theme.spacing(1),
  },
}));

const Settings = ({ settings, setSettings }) => {
  const classes = useStyles();

  const handleChange = (event) => {
    setSettings({ ...settings, [event.target.name]: event.target.checked });
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={settings.showGrid}
            onChange={handleChange}
            name="showGrid"
            color="primary"
            className={classes.switch}
          />
        }
        label="Show Grid"
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.showFrames}
            onChange={handleChange}
            name="showFrames"
            color="primary"
            className={classes.switch}
          />
        }
        label="Show Frames"
      />
    </FormGroup>
  );
};

export default Settings;