import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import TableContentContainer from '../../TableContentContainer';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  DEVICES_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import devicesQuery from '../utils/deviceQuery';
import devicesSubscription from '../utils/devicesSubscription';

class DeviceTypes extends React.Component {
    openDevices = () => {
      this.props.openDevices(DEVICES_CONTENT_TYPE);
    };

    renderTableRow = deviceType => (
      <React.Fragment key={deviceType.id}>
        <StyledTableCell align="left">Device name</StyledTableCell>
        <StyledTableCell align="left">Fields</StyledTableCell>
        <StyledTableCell align="left">Devices</StyledTableCell>
        <StyledTableCell align="right">
          <Tooltip title="Clone device type">
            <IconButton
              aria-label="clone device type"
            >
              <QueueOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit device type">
            <IconButton
              aria-label="edit device type"
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open device type" className={this.props.classes.arrowButton}>
            <IconButton
              aria-label="open device type"
              onClick={this.openDevices}
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
          title: 'Fields',
        },
        { key: 2,
          title: 'Devices',
        },
        { key: 3,
          title: '',
        },
      ];

      return (
        <>
          <ContentHeader
            title="Devices types"
            searchPlaceholder="Search Devices types"
            addButtonText="Add device type"
          />
          <TableContentContainer
            subscriptionUpdateField="devicesUpdated"
            dataType={DEVICES_CONTENT_TYPE}
            query={devicesQuery}
            queryArgs={[this.props.experimentId, this.props.entityType]}
            tableHeadColumns={tableHeadColumns}
            subscription={devicesSubscription}
            renderRow={this.renderTableRow}
          />
        </>
      );
    }
}

export default withStyles(styles)(DeviceTypes);