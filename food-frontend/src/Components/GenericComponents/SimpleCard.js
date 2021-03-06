
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActionArea } from '@material-ui/core';

const styles = {
  card: {
    width: '100 %',
    marginBottom:20,
    marginTop:20,
    padding: 10,
  },
  cardAction:{
    padding:0
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
};

class SimpleCard extends Component {

    render(){
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        const item = this.props.item
        return (
            <Card className={classes.card}>
            <CardActionArea
            className = {classes.cardAction}>
            <CardContent>
                <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                    {item.name}
                </Typography>
                <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                    {item.id}
                </Typography>
            </CardContent>
            </CardActionArea>
            </Card>
        );
    }

}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);