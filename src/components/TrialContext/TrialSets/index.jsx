import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ContentTable from '../../ContentTable';
import trialSetsQuery from '../utils/trialSetQuery';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';

class TrialSets extends React.Component {
    renderTableRow = (trialSet) => {
      const { history, match, classes } = this.props;

      return (
        <React.Fragment key={trialSet.key}>
          <StyledTableCell align="left">{trialSet.name}</StyledTableCell>
          <StyledTableCell align="left">{trialSet.numberOfTrials}</StyledTableCell>
          <StyledTableCell align="left">{trialSet.description}</StyledTableCell>
          <StyledTableCell align="right">
            <CustomTooltip title="Clone" ariaLabel="clone">
              <CloneIcon />
            </CustomTooltip>
            <CustomTooltip title="Edit" ariaLabel="edit">
              <PenIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Open"
              className={classes.arrowButton}
              ariaLabel="open"
              onClick={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${trialSet.key}/${TRIALS}`)}
            >
              <ArrowForwardIosIcon />
            </CustomTooltip>
          </StyledTableCell>
        </React.Fragment>
      );
    };

    render() {
      const tableHeadColumns = [
        { key: 0,
          title: '',
        },
        { key: 1,
          title: 'Trials',
        },
        { key: 2,
          title: 'Description',
        },
        { key: 3,
          title: '',
        },
      ];
      const { history, match } = this.props;

      return (
        <>
          <ContentHeader
            withSearchInput
            title="Trial sets"
            searchPlaceholder="Search trial sets"
            addButtonText="Add trial set"
            addButtonHandler={() => history.push(`/experiments/${match.params.id}/add-trial-set`)}
          />
          <ContentTable
            contentType={TRIAL_SETS}
            query={trialSetsQuery(match.params.id)}
            tableHeadColumns={tableHeadColumns}
            renderRow={this.renderTableRow}
          />
        </>
      );
    }
}

export default compose(
  withRouter,
  withStyles(styles),
)(TrialSets);
