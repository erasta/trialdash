import React from 'react';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import ContentHeader from '../../ContentHeader';
import {
  DEVICE_TYPES_DASH,
  DEVICES,
} from '../../../constants/base';
import StyledTableCell from '../../StyledTableCell';
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import devicesQuery from './utils/deviceQuery';
import ContentTable from '../../ContentTable';

class Devices extends React.Component {
  state = {
    deviceType: {},
  };

  componentDidMount() {
    const { match, client } = this.props;

    client
      .query({ query: deviceTypesQuery(match.params.id) })
      .then((data) => {
        this.setState({
          deviceType: data.data.deviceTypes.find(
            deviceType => deviceType.key === match.params.deviceTypeKey,
          ),
        });
      });
  }

  renderTableRow = device => (
    <React.Fragment key={device.key}>
      <StyledTableCell align="left">{device.name}</StyledTableCell>
      <StyledTableCell align="left">{device.id}</StyledTableCell>
      {device.properties.map(property => (
        <StyledTableCell key={property.key} align="left">
          {property.val}
        </StyledTableCell>
      ))}
      <StyledTableCell align="right">
        <CustomTooltip title="Clone" ariaLabel="clone">
          <CloneIcon />
        </CustomTooltip>
        <CustomTooltip title="Edit" ariaLabel="edit">
          <PenIcon />
        </CustomTooltip>
      </StyledTableCell>
    </React.Fragment>
  );

  generateTableColumns = (deviceType) => {
    const columns = [
      { key: uuid(), title: 'device name' },
      { key: uuid(), title: 'id' },
    ];

    if (!isEmpty(deviceType) && !isEmpty(deviceType.properties)) {
      deviceType.properties.forEach((property, index) => {
        if (index === deviceType.properties.length - 1) { // the last column is static (buttons)
          columns.push(
            { key: uuid(), title: property.label },
            { key: uuid(), title: '' },
          );

          return;
        }

        columns.push({ key: uuid(), title: property.label });
      });
    }

    return columns;
  };

  render() {
    const { history, match } = this.props;
    const { deviceType } = this.state;
    const tableHeadColumns = this.generateTableColumns(deviceType);

    return (
      <>
        <ContentHeader
          withSearchInput
          title={deviceType.name}
          searchPlaceholder="Search Devices"
          addButtonText="Add device"
          withBackButton
          backButtonHandler={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}`)}
          rightDescription={deviceType.id}
          addButtonHandler={() => history.push(
            `/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${match.params.deviceTypeKey}/add-device`,
          )}
        />
        <ContentTable
          contentType={DEVICES}
          query={devicesQuery(match.params.id, match.params.deviceTypeKey)}
          tableHeadColumns={tableHeadColumns}
          renderRow={this.renderTableRow}
        />
      </>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
)(Devices);
