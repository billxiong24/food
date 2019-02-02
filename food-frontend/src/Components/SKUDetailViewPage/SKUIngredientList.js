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
import { CardActionArea } from '@material-ui/core';
import { routeToPage } from '../../Redux/Actions';
import { ingDetSetIng } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { Icon, IconButton } from '@material-ui/core';
import delete_icon from '../../Resources/Images/delete_button_1.svg'
import labels from '../../Resources/labels';
import { addToList, removeFromList } from '../../Resources/common';

const styles = {
    card: {
        width: '100 %',
        marginBottom:20,
        marginTop:20,
        backgroundColor:labels.colors.primaryColor
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
      button:{
          width:'100%'
      }

};

class SKUIngredientList extends Component {

    constructor(props){
        super(props);
        this.state = {
            deleted_list:[],
            active_list: this.props.ingredients
        }
    }


    componentWillMount() {

    }

    onClick = (item) =>{
        this.setState({
            deleted_list: addToList(item, this.state.deleted_list)
        })
        // console.log(removeFromList(this.state.deleted_list, this.state.active_list))
        this.setState({
            active_list: removeFromList(this.state.deleted_list, this.state.active_list)
        })
        // console.log("SKUINGREDIENTLIST COMPONENT")
        // console.log("DELETED LIST")
        // console.log(this.state.deleted_list)
        // console.log("ACTIVE LIST")
        // console.log(this.state.active_list)
    }

    render() {
        const { classes } = this.props
        
        return (
            <div>
                {
                this.state.active_list.map((item, index) => (
                    <Card className={classes.card} key={index}>
                        <CardActionArea
                        className = {classes.cardAction}
                        >
                        <CardContent onClick={() => this.onClick(item)}>
                            <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                                {item.num}
                            </Typography>
                            <IconButton className={classes.icon} onClick ={(e) => console.log("deleted")}>
                                <img src={delete_icon} />
                             </IconButton>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                ))
                }
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.sku_details.ingredients
    };
};

const mapDispatchToProps = dispatch => {
    
};  

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUIngredientList));
