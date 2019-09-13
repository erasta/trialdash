import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import TableContentContainer from '../../TableContentContainer';
import trialSetsQuery from '../utils/trialSetQuery';
import trialSetsSubscription from '../utils/trialSetsSubscription';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import { TRIAL_SETS_CONTENT_TYPE, TRIALS_CONTENT_TYPE } from '../../../constants/base';
import ContentHeader from '../../ContentHeader';

class TrialSets extends React.Component {
    openTrials = () => {
      this.props.openTrials(TRIALS_CONTENT_TYPE);
    };

    renderTableRow = trialSet => (
      <React.Fragment key={trialSet.id}>
        <StyledTableCell align="left">Trial set</StyledTableCell>
        <StyledTableCell align="left">Trials</StyledTableCell>
        <StyledTableCell align="left">{trialSet.notes}</StyledTableCell>
        <StyledTableCell align="right">
          <Tooltip title="Clone trial set">
            <IconButton
              aria-label="clone trial set"
            >
              <QueueOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit trial set">
            <IconButton
              aria-label="edit trial set"
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open trial set" className={this.props.classes.arrowButton}>
            <IconButton
              aria-label="open trial set"
              onClick={this.openTrials}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
      </React.Fragment>
    );

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

      return (
        <>
          <ContentHeader
            title="Trial sets"
            searchPlaceholder="Search trial sets"
            addButtonText="Add trial set"
          />
          <TableContentContainer
            subscriptionUpdateField="trialSetsUpdated"
            dataType={TRIAL_SETS_CONTENT_TYPE}
            query={trialSetsQuery}
            queryArgs={[this.props.experimentId]}
            tableHeadColumns={tableHeadColumns}
            subscription={trialSetsSubscription}
            renderRow={this.renderTableRow}
          />
        </>
      );
    }
}

export default withStyles(styles)(TrialSets);