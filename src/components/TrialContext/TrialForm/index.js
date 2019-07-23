import React from 'react';
import PropTypes from 'prop-types';
import { styles } from './styles';
import devicesQuery from '../../DeviceContext/utils/deviceQuery';
import assetsQuery from '../../AssetContext/utils/assetQuery';
import trialMutation from './utils/trialMutation';
import Graph from '../../../apolloGraphql';
import LeafLetMap from '../LeafLetMap';
import Entity from './entity';

import classes from './styles';
//MATERIAL UI DEPENDENCIES
import { withTheme, makeStyles, useTheme } from '@material-ui/core/styles';

// import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import FormControl from '@material-ui/core/FormControl';

const graphql = new Graph();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    }
}));

function getStyles(device, devices, theme) {
    return {
        fontWeight:
            devices.indexOf(device) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

class TrialForm extends React.Component {
    constructor(props) {
        super(props);
        let properties = props.properties || [];
        if (props.trialSet && props.trialSet.properties) {
            props.trialSet.properties.forEach(p => {
                let property = properties.find(pr => pr.key === p.key);
                if (property) property.type = p.val;
                else properties.push({ key: p.key, val: '', type: p.val });
            });
        }
        this.state = {
            expanded: null,
            experiments: [],
            experimentId: props.experimentId,
            devicesList: [],
            devices: props.devices || [],
            assetsList: [],
            assets: props.assets || [],
            id: props.id || null,
            name: props.name || '',
            begin: props.begin || null,
            end: props.end || null,
            trialSet: props.trialSet,
            properties: properties,
            errors: {}
        };
    }

    handleChangeMultiple = key => event => {        
        let properties = event.target.value.properties.map(p => { return({ key: p.key, val: p.val, type: p.type })})
        let obj = this.state[key] || [];
        obj.push({ entity: event.target.value, properties });

        this.setObj(key, obj);
    }

    removeEntity = (key, id) => {
        let obj = this.state[key].filter(e => e.entity.id !== id)
        this.setObj(key, obj);
    }

    setObj(key, obj) {
        if (key === 'devices') {
            let existingDevices = obj.map(d => d.entity.id);
            this.state.devicesList = this.state.allDevices.filter(d => existingDevices.indexOf(d.id) === -1);
        }

        if (key === 'assets') {
            let existingAssets = obj.map(d => d.entity.id);
            this.state.assetsList = this.state.allAssets.filter(d => existingAssets.indexOf(d.id) === -1);
        }

        this.setState({
            [key]: obj
        });
    }

    componentDidMount() {
        graphql.sendQuery(devicesQuery(this.props.experimentId, 'device'))
          .then(data => {
            let existingDevices = this.state.devices.map(d => d.entity.id);
            this.setState(() => ({
              allDevices: data.devices,
              devicesList: data.devices.filter(d => existingDevices.indexOf(d.id) === -1)
            }));
          })
          .then(() => {
            setTimeout(() => {
              this.setState(() => ({ timeout: true }))
            }, 5000)
          })

        graphql.sendQuery(assetsQuery(this.props.experimentId, 'asset'))
          .then(data => {
            let existingAssets = this.state.assets.map(d => d.entity.id);
            this.setState(() => ({
              allAssets: data.assets,
              assetsList: data.assets.filter(d => existingAssets.indexOf(d.id) === -1)
            }));
          })
          .then(() => {
            setTimeout(() => {
              this.setState(() => ({ timeout: true }))
            }, 5000)
          })
    }


    handleChange = key => event => {
        this.setState({
            [key]: event.target.value,
        });
    };

    handleChangeProprty = (index, key, entityType, entityIndex) => event => {
        if (entityType) this.state[entityType][entityIndex].properties[index][key] = event.target.value;
        else this.state.properties[index][key] = event.target.value;
        this.setState({ });
    };

    submitTrial = () => {
        this.setState({errors: {}});
        const errors = {};
        let e = false;
        if (!this.state.trialSet || !this.state.trialSet.id) {
            errors.trialSet = true;
            e = true;
        }
        if (e) {
            this.setState({ errors: errors });
            return;
        }
        const newTrial = {
            id: this.state.id,
            name: this.state.name,
            begin: this.state.begin,
            end: this.state.end,
            trialSet: this.state.trialSet.id,
            properties: this.state.properties.map(p => {return({ key: p.key, val: p.val })}),
            devices: this.state.devices.map(d => {return({ entity: d.entity.id, properties: d.properties.map(p => {return({ key: p.key, val: p.val })}), type: 'device' })}),
            assets: this.state.assets.map(d => {return({ entity: d.entity.id, properties: d.properties.map(p => {return({ key: p.key, val: p.val })}), type: 'asset' })}),
            experimentId: this.state.experimentId
        };

        let _this = this;

        graphql.sendMutation(trialMutation(newTrial))
            .then(data => {
                window.alert(`saved trial ${data.addUpdateTrial.id}`);
                _this.props.showAll();
            })
            .catch(err => {
                window.alert(`error: ${err}`);
            });
    }

    render() {

        return (
            <form style={classes.container} noValidate autoComplete="off" style={{ display: 'flex', textAlign: 'left' }}>
                <div>
                    <div>{this.state.id ? `Edit trial of trialSet ${this.state.trialSet.name}` : `Add trial to trialSet ${this.state.trialSet.name}`}</div>
                    <TextField style={{ width: '300px', 'marginTop': '30px' }}
                        id="name"
                        label="Name"
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                    />
                    <br />
                    <TextField style={{ width: '300px', 'marginTop': '30px' }}
                        id="begin"
                        label="Begin"
                        type="date"
                        className={classes.textField}
                        value={this.state.begin}
                        onChange={this.handleChange('begin')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <br />
                    <TextField style={{ width: '300px', 'marginTop': '30px' }}
                        id="end"
                        label="End"
                        type="date"
                        className={classes.textField}
                        value={this.state.end}
                        onChange={this.handleChange('end')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <br />
                    <TextField style={{ width: '300px', 'marginTop': '30px' }}
                        id="trialSet"
                        label="Tial Set"
                        type="text"
                        readonly
                        className={classes.textField}
                        value={this.state.trialSet.name}
                    />                    
                    <br />
                    <h3>properties:</h3>
                    {this.state.properties.map((p, i) => {
                        if(p.type === 'location') return <LeafLetMap onChange={this.handleChangeProprty(i, 'val')} location={p.val && p.val !== '' ? p.val.split(',') : [0, 0]}/>
                        else
                            return <div key={i} style={{display: 'flex'}}>
                                <TextField style={{ width: '300px' }}
                                    type={p.type}
                                    label={p.key}
                                    className={classes.textField}
                                    value={p.val}
                                    onChange={this.handleChangeProprty(i, 'val')}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <br />
                            </div>
                        
                    })}
                    <Entity entities={this.state.devices} entityName={'devices'} removeEntity={this.removeEntity} handleChangeMultiple={this.handleChangeMultiple} handleChangeProprty={this.handleChangeProprty} entitiesList={this.state.devicesList}/>
                    <Entity entities={this.state.assets} entityName={'assets'} removeEntity={this.removeEntity} handleChangeMultiple={this.handleChangeMultiple} handleChangeProprty={this.handleChangeProprty} entitiesList={this.state.assetsList}/>
                    <FormControl className={classes.formControl} style={{ width: '300px', 'marginTop': '30px' }}>
                        <div style={{ 'marginTop': '50px', textAlign: 'center', display: 'flex' }}>
                            <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                                onClick={this.submitTrial}
                            >
                                Submit
                            </Button>
                            {this.props.cancel && <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                                onClick={this.props.showAll}
                            >
                                Cancel
                            </Button>}
                        </div>
                    </FormControl>

                </div>
            </form>
        );
    }
}

TrialForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withTheme(TrialForm);