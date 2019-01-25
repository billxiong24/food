
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropdownMultiple, Dropdown } from 'reactjs-dropdown-component';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    card: {
        width: '100 %',
        marginBottom: 20,
        marginTop: 20,
        padding: 10
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    ingredrient_name: {
        fontSize: 14,
        float: 'left'
    },
    ingredient_id: {
        fontSize: 14,
        float: 'right'
    },
    pos: {
        marginBottom: 12,
    },
};

class DropdownButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: [
                {
                    id: 0,
                    title: 'New York',
                    selected: false,
                    key: 'location'
                },
                {
                    id: 1,
                    title: 'Dublin',
                    selected: false,
                    key: 'location'
                },
                {
                    id: 2,
                    title: 'Istanbul',
                    selected: false,
                    key: 'location'
                }
            ],
            fruit: [
                {
                    id: 0,
                    title: 'Apple',
                    selected: false,
                    key: 'fruit'
                },
                {
                    id: 1,
                    title: 'Orange',
                    selected: false,
                    key: 'fruit'
                },
                {
                    id: 2,
                    title: 'Strawberry',
                    selected: false,
                    key: 'fruit'
                }
            ]
        }
    }

    resetThenSet = (id, key) => {
        let temp = JSON.parse(JSON.stringify(this.state[key]));
        temp.forEach(item => item.selected = false);
        temp[id].selected = true;
        this.setState({
            [key]: temp
        });
    }

    render() {
        const { classes } = this.props;
        // console.log(this.props)
        return (
            <Dropdown
                title="Select fruit"
                list={this.state.fruit}
                resetThenSet={this.resetThenSet}
            />
        );
    }

}

export default withStyles(styles)(DropdownButton);