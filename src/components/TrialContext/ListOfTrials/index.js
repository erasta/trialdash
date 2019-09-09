import React from "react";
import PropTypes from "prop-types";
import Graph from "../../../apolloGraphql";
import trialsQuery from "../utils/trialQuery";
import buildData from "../utils/build-data";
import TrialForm from "../TrialForm";
import devicesQuery from "../../DeviceContext/utils/deviceQuery";
import trialMutation from "../TrialForm/utils/trialMutation";

import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import QueueOutlinedIcon from "@material-ui/icons/QueueOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import { Query, Subscription } from "react-apollo";
import { styles } from "./styles";

const graphql = new Graph();

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: "#F5F5F5",
    fontSize: 12,
    textTransform: "uppercase",
    color: "#4F4F4F",
    fontWeight: "bold",
    border: 0
  },
  body: {
    backgroundColor: "#fff",
    padding: "15px 0 15px 20px",
    border: 0
  }
}))(TableCell);

class ListOfTrials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trials: props.trials || [],
      timeout: false,
      experimentId: props.experimentId || ""
    };
  }

  componentDidMount() {}
  componentDidUpdate() {
    if (this.state.experimentId !== this.props.experimentId) {
      const experimentId = this.props.experimentId;
      this.setState(() => ({ experimentId, editTrial: null }));
      this.fetchTrials(experimentId);
    }
  }
  fetchTrials = experimentId => {
    graphql
      .sendQuery(trialsQuery(experimentId))
      .then(data => this.setState(() => ({ trials: data.trials })));
  };

  cloneTrial = trial => {
    // let newTrial = JSON.parse(JSON.stringify(trial));
    // newTrial.id = null;
    // let _this = this;

    const newTrial = {
      id: null,
      name: trial.name,
      notes: trial.notes,
      begin: trial.begin,
      end: trial.end,
      trialSet: trial.trialSet.id,
      properties: trial.properties
        ? trial.properties.map(p => {
            return { key: p.key, val: p.val };
          })
        : [],
      devices: trial.devices
        ? trial.devices.map(d => {
            return {
              entity: d.entity.id,
              properties: d.properties
                ? d.properties.map(p => {
                    return { key: p.key, val: p.val };
                  })
                : [],
              type: "device"
            };
          })
        : [],
      assets: trial.assets
        ? trial.assets.map(d => {
            return {
              entity: d.entity.id,
              properties: d.properties
                ? d.properties.map(p => {
                    return { key: p.key, val: p.val };
                  })
                : [],
              type: "asset"
            };
          })
        : [],
      experimentId: this.state.experimentId
    };

    graphql
      .sendMutation(trialMutation(newTrial))
      .then(data => {
        window.alert(`saved trial ${data.addUpdateTrial.id}`);
        // _this.props.showAll();
      })
      .catch(err => {
        window.alert(`error: ${err}`);
      });
  };

  buildData = trial => {
    graphql
      .sendMutation(buildData(trial))
      .then(data => {
        window.alert(data.buildExperimentData);
      })
      .catch(err => {
        window.alert(`error: ${err}`);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.state.editTrial ? (
          <div className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left"></StyledTableCell>
                  <StyledTableCell align="left">Trial Begin</StyledTableCell>
                  <StyledTableCell align="left">Trial End</StyledTableCell>
                  <StyledTableCell align="left">Trial Devices</StyledTableCell>
                  <StyledTableCell align="left"></StyledTableCell>
                  <StyledTableCell align="left"></StyledTableCell>
                  <StyledTableCell align="left"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.trials.map((trial, index) => (
                  <TableRow key={index} className={classes.tableBodyRow}>
                    <StyledTableCell
                      align="left"
                      className={classes.firstColumn}
                    >
                      {trial.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {trial.begin}
                    </StyledTableCell>
                    <StyledTableCell align="left">{trial.end}</StyledTableCell>
                    <StyledTableCell align="left">
                      {trial.device && trial.device.name}
                    </StyledTableCell>
                    <StyledTableCell align="left"></StyledTableCell>
                    <StyledTableCell align="left"></StyledTableCell>

                    <StyledTableCell align="right">
                      <Tooltip title="Clone the trial">
                        <IconButton
                          aria-label="clone the trial"
                          onClick={() => this.cloneTrial(trial)}
                        >
                          <QueueOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit the trial">
                        <IconButton
                          aria-label="edit the trial"
                          onClick={() => this.setState({ editTrial: trial })}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Build the trial"
                        className={classes.arrowButton}
                      >
                        <IconButton
                          aria-label="build the trial"
                          onClick={() => this.buildData(trial)}
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <TrialForm
            {...this.state.editTrial}
            experimentId={this.state.experimentId}
            cancel
            showAll={() => this.setState({ editTrial: null })}
          />
        )}
      </div>
    );
  }
}

ListOfTrials.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListOfTrials);
