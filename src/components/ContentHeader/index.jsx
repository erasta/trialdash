import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { styles } from './styles';
import SimpleButton from '../SimpleButton';

const ContentHeader = (props) => {
  const {
    classes,
    title,
    searchPlaceholder,
    addButtonText,
    withBackButton,
    backButtonHandler,
    topDescription,
    rightDescription,
    addButtonHandler,
    bottomDescription,
    withSearchInput,
    className,
    rightComponent,
  } = props;

  return (
    <Grid container justify="space-between" className={classnames(classes.header, className)}>
      <Box
        display="flex"
        alignItems="center"
      >
        {withBackButton ? (
          <KeyboardBackspaceIcon
            className={classes.backIcon}
            onClick={backButtonHandler}
          />
        ) : null}
        <Box display="inline-block">
          <Box display="inline-block">
            {topDescription ? <p className={classes.topDescription}>{topDescription}</p> : null}
            <h1 className={classes.title}>{title}</h1>
          </Box>
          {rightDescription ? (
            <div className={classes.rightDescription}>{rightDescription}</div>
          ) : null}
          {bottomDescription ? (
            <div className={classes.bottomDescription}>{bottomDescription}</div>
          ) : null}
        </Box>
      </Box>
      {withSearchInput ? (
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder={searchPlaceholder}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
              focused: classes.inputFocused,
            }}
            inputProps={{ 'aria-label': searchPlaceholder }}
          />
          <SimpleButton
            colorVariant="primary"
            className={classes.addButton}
            text={addButtonText}
            onClick={addButtonHandler}
          />
        </div>
      ) : rightComponent}
    </Grid>
  );
};

export default withStyles(styles)(ContentHeader);
