import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ItemList from '../GenericComponents/ItemList';
import SimpleCard from '../GenericComponents/SimpleCard';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActionArea, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { routeToPage } from '../../Redux/Actions';
import { withRouter } from 'react-router-dom'
import { ingDetSetIng, ingDetGetSkus } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import labels from '../../Resources/labels';
import { mapStateToProps, mapDispatchToProps } from './DataConverter';
import Checkbox from '@material-ui/core/Checkbox';
import swal from 'sweetalert';

const styles = {
    card: {
        width: '100 %',
        marginBottom:20,
        marginTop:20,
      },
      cardAction:{
        padding:10
      },
      bullet: {
        display: 'inline-block',
        margin: '0 2px',
      },
      ingredrient_name: {
        fontSize: 14,
        float:'left',
        fontFamily: 'Open Sans',
        fontWeight: 400,
      },
      ingredient_id: {
        fontSize: 14,
        float:'right',
        fontFamily: 'Open Sans',
        fontWeight: 400,
      },
      pos: {
        marginBottom: 12,
      },
      ingredient_id: labels.common_styles.simple_list_text,
      button:{
          width:'100%'
      },
      checkbox:{
          marginRight: "auto",
          float:"right"
      },
      item:{
          height: "100px",
          
      }

};

class GoalList extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    onClick = (item) =>{
        console.log(item)
        //  this.props.setIngredient(item, this.props.history)
        if(item.enabled){
            // if(window.confirm(`Do you want to disable ${item.name} goal`)) {
            //     this.props.goal_set_enable(item, !item.enabled)
            // }
            // swal(`Disable ${item.name}? `, {
            //     buttons: ["Cancel", "Disable"],
            //   });
            // swal({
            //     button: {
            //         cancel: {
            //           text: "Cancel",
            //           value: null,
            //           visible: false,
            //           className: "",
            //           closeModal: true,
            //         },
            //         confirm: {
            //           text: "OK",
            //           value: true,
            //           visible: true,
            //           className: "",
            //           closeModal: true
            //         }
            //       },
            //   });
            swal(`Disable ${item.name}? `, {
                dangerMode: true,
                buttons: ["No", "Yes"],
              })
              .then((value) => {
                if(value){
                    this.props.goal_set_enable(item, !item.enabled)
                }
            })
        }else{
            // if(window.confirm(`Do you want to enable ${item.name} goal`)) {
            //     this.props.goal_set_enable(item, !item.enabled)
            // }
            // swal(`Enable ${item.name}? `, {
            //     buttons: ["Cancel", "Enable"],
            //   });
            swal(`Enable ${item.name}? `, {
                buttons: ["No", "Yes"],
              })
            .then((value) => {
                if(value){
                    this.props.goal_set_enable(item, !item.enabled)
                }
            })
        }
        
    }

    render() {
        const { classes, ingredients, history, sortby } = this.props
        
        return (
            <div>
                {
                this.props.filtered_goals.map((item, index) => (
                    // <Card className={classes.card} key={index} onClick = {() => {this.onClick(item)}}>
                    //     <CardActionArea
                    //     className = {classes.cardAction}
                    //     >
                    //     <CardContent onClick={console.log("")}>
                    //         <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                    //             {item.name}
                    //         </Typography>
                    //         <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                    //             {"enabled:" + item.enabled}
                    //         </Typography>
                    //     </CardContent>
                    //     </CardActionArea>
                    // </Card>
                    <ListItem 
                            button 
                            onClick={() => { this.onClick(item) }}
                            divider={true}
                        >
                            <div className={classes.ingredient_id}>
                                {item.name}
                            </div>
                            <ListItemSecondaryAction>
                            <Checkbox
                                    checked={item.enabled}
                                    className={classes.checkbox}
                                    onClick={() => { this.onClick(item) }}
                                />
                            </ListItemSecondaryAction>
    
                    </ListItem>
                ))
                }
            </div>

        );
    }
}


export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(GoalList)));
