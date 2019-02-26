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
import { routeToPage, skuAddSelected, skuRemoveSelected } from '../../Redux/Actions';
import { withRouter } from 'react-router-dom'
import { skuDetGetManLines, skuDetGetFormula, skuDetSetSku, skuDetGetIng, skuDetGetProductLine } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import labels from '../../Resources/labels';
import Checkbox from '@material-ui/core/Checkbox';

const styles = {
  entry: {
    width: '100%',
    display:'flex',
    flexDirection:'row',
  },
  card: {
    display:'flex',
    flexGrow: '8',
    marginBottom: 10,
    marginTop: 10,
  },
  cardAction: {
    padding: 10
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
  },
  ingredrient_name: {
    fontSize: 14,
    float: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 400,
  },
  ingredient_id: {
    fontSize: 14,
    float: 'right',
    fontFamily: 'Open Sans',
    fontWeight: 400,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    width: '100%'
  }
};

class SKUList extends Component {

  constructor(props) {
    super(props);
  }


  componentWillMount() {

  }

  onClick = (item) => {
    this.props.setSku(item)
  }

  handleChange = (sku) => {
    if(this.props.selected.includes(sku.id)) {
      this.props.removeSelected([sku.id]);
    } else {
      this.props.addSelected([sku.id]);
    }
  }

  render() {
    const { classes, SKUs, sortby, selected } = this.props
    return (
      <div>
        {
          this.props.SKUs.map((item, index) => (
            <div key={index} className={classes.entry}>
              <Checkbox
                checked={selected.includes(item.id)}
                onChange={() => { this.handleChange(item) }}
                value="Select"
              />
              <Card className={classes.card} onClick={() => { this.onClick(item) }}>
                <CardActionArea
                  className={classes.cardAction}
                >
                  <CardContent>
                    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                      {sortby == labels.skus.sort_by.SKU_NAME ? item.num : item[labels.skus.sort_by_map[sortby]]}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    SKUs: state.skus.items,
    sortby: state.skus.sortby,
    selected: state.skus.selectedSkus,
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
                    return Promise.resolve(dispatch(skuDetGetManLines(sku.id)));
            })
            .then(function(r) {
                    ownProps.history.push('/skus/details')
            })
        },
        addSelected: (sku) => {
          dispatch(skuAddSelected(sku));
        },
        removeSelected: (sku) => {
          dispatch(skuRemoveSelected(sku));
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SKUList)));
