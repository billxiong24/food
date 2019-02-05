import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  card: {
    width: '100 %',
    marginBottom:10,
    marginTop:10,
    padding: 10,
  },
  card_content: {
    textAlign:'left',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
  },
  ingredrient_name: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 400,
    textAlign:'left',
    marginLeft: 30,
    display:'inline-block',
  },
  ingredient_id: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 1000,
    width:'5%',
    textAlign:'right',
    display:'inline-block',
  },
  pos: {
    marginBottom: 12,
  },
  close_button: {
    float:'right',
    padding:'0px',
    'margin-top':'-5px'
  },
};

class SimpleCard extends Component {
    render(){
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        const item = this.props.item
        // console.log(this.props)
        return (
          <Card className={classes.card}>
            <div className={classes.card_content}>
              <CardContent>
                <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                  {item.quantity}
                </Typography>
                <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                  {item.name + ": " + item.unit_size + " * " + item.count_per_case}
                </Typography>
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.button + ' ' + classes.close_button}
                  onClick={() => { this.props.onDelete(item) }}
                >
                  <CloseIcon />
                </IconButton>
              </CardContent>
            </div>
          </Card>
        );
    }

}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);