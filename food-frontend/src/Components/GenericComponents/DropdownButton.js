
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dropdown from './Dropdown';

const styles = {
    card: {
        width: '100 %',
        marginBottom: 20,
        marginTop: 20,
        padding: 10,
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
               super(props);
        let {items, selected_index} = this.props
        let list = []
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var obj = {
                id:i,
                title: item,
                selected: false,
                key: 'list' 
            };
            list.push(obj);
       }
        this.state = {
            list: list
        }
        this.resetThenSet(selected_index, 'list')
    }

    resetThenSet = (id, key) => {
        console.log(key)
        console.log(this.state)
        let temp = this.state[key];
        console.log(temp)
        for (var i = 0; i < temp.length; i++) {
            temp[i].selected = false;
       }
        temp[id].selected = true;
        this.setState({
            [key]: temp
        });
        if (this.props.onSelect != null){
            // your code here.
            this.props.onSelect(id)
        }
    }

    render() {
        const { classes, items, selected_index } = this.props;
        return (
            <Dropdown
                title={this.state.list[selected_index].title}
                list={this.state.list}
                resetThenSet={this.resetThenSet}
            />
        );
    }
}

export default withStyles(styles)(DropdownButton);