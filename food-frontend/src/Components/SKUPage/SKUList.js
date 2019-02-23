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
import { withRouter } from 'react-router-dom'
import { skuDetGetFormula, skuDetSetSku, skuDetGetIng, skuDetGetProductLine } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import labels from '../../Resources/labels';

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
      button:{
          width:'100%'
      }
};

class SKUList extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    onClick = (item) => {
        console.log(item)
        this.props.setSku(item)
    }

    render() {
        const { classes, SKUs, sortby } = this.props
        return (
            <div>
            {
            this.props.SKUs.map((item, index) => (
                <Card className={classes.card} key={index} onClick = {() => {this.onClick(item)}}>
                    <CardActionArea
                    className = {classes.cardAction}
                    >
                    <CardContent onClick={console.log("")}>
                        <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                            {item.name}
                        </Typography>
                        <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                            {sortby == labels.skus.sort_by.SKU_NAME ? item.num : item[labels.skus.sort_by_map[sortby]]}
                        </Typography>
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
        SKUs: state.skus.items,
        sortby: state.skus.sortby
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        setSku: sku => {
            Promise.resolve(dispatch(skuDetGetProductLine())) // dispatch
                .then(function (response) {
                    return Promise.resolve(dispatch(skuDetSetSku(sku)));
                //return response;
                })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetFormula(sku.formula_id)));

            })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetIng(sku.id)));
            })
            .then(function(r) {
                    ownProps.history.push('/skus/details')
            })
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUList)));
