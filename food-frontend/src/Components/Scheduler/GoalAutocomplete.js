import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import labels from '../../Resources/labels';
import { ingAddFilter, ingSearch, ingGetSkus, ingAddError, ingDeleteError } from '../../Redux/Actions';
import { skuFormatter } from '../../Scripts/Formatters';
import { mapStateToProps, mapDispatchToProps } from './DataConverter';

const styles = {
    autosuggest:{
        fontSize: 14,
        fontFamily: 'Open Sans',
        fontWeight: 300
    }
};

class GoalAutocomplete extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    onGoalNameEnter = (input) => {
        // console.log(input + ":" + this.props.filter_type)
        // console.log((input + ":" + this.props.filter_type).hashCode())
        // let new_filter = {
        //     type: this.props.filter_type,
        //     string: input,
        //     id: (input + ":" + this.props.filter_type).hashCode()
        // }
        
        this.props.get_filtered_goals(input, this.props.filter_type_index);
    }

    onGoalNameSuggest = (input, num) => {
        // let new_filter = {
        //     type: this.props.filter_type,
        //     string: input,
        //     id: (input + ":" + this.props.filter_type).hashCode()
        // }
        this.props.get_filtered_goals(input, this.props.filter_type_index);
    }

    onGoalUserNameEnter = (input) => {
        //this.props.pushError({errMsg: "Choose SKU Filter from Suggestions List", id:"Choose SKU Filter from Suggestions List".hashCode()})
        //this.props.pushError({errMsg: input, id:input.hashCode()})
        this.props.get_filtered_goals(input, this.props.filter_type_index);
    }
    
    onGoalUserNameSuggest = (input, num) => {
        // let new_filter = {
        //     type: this.props.filter_type,
        //     string: input,
        //     id: num
        // }
        this.props.get_filtered_goals(input, this.props.filter_type_index);
    }

    onChange = (input) => {
        this.props.set_filter(input, this.props.filter_type_index)
    }

    render() {
        const { classes, goal_names, goal_user_names, filter_type_index } = this.props
        return (
            filter_type_index == 0 ?
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={goal_names.map(goal_name => ({label:goal_name, id:null}))}
                    placeholder={"Search by Goal Name"}
                    onEnter = {this.onGoalNameEnter}
                    onSuggest = {this.onGoalNameSuggest}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest>
            :
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={goal_user_names.map(goal_user_name => ({label:goal_user_name, id:null}))}
                    placeholder={"Search by User Name"}
                    onEnter = {this.onGoalUserNameEnter}
                    onSuggest = {this.onGoalUserNameSuggest}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest>
        );
    }
}


export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(GoalAutocomplete));
