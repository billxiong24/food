
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  card: {
    width: '100 %',
    marginBottom:20,
    marginTop:20,
    padding: 10
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  ingredrient_name: {
    fontSize: 14,
    float:'left'
  },
  ingredient_id: {
    fontSize: 14,
    float:'right'
  },
  pos: {
    marginBottom: 12,
  },
  close_button: {
    float:'right',
    padding:'0px',
    'margin-top':'-5px'
  }
};

class ManufacturingGoalsCard extends Component {
    constructor(props) {
      super(props);
      this.state={
        editting: false,
        text: ''
      }
    }

    componentDidMount() {
      document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = event => {
      const domNode = ReactDOM.findDOMNode(this);

      if (!domNode || !domNode.contains(event.target)) {
        this.setState({
          editting: false
        });
      }
    }

    edit() {
      if(this.props.editable) {
        this.setState({
          editting: true,
        });
        if(this.props.item.id) {
          this.setState({
            text: this.props.item.name
          })
        }
      }
    }

    textChange(e) {
      this.setState({
        text: e.target.value
      })
    }

    onEnter(e) {
      if(e.which === 13 || e.keyCode === 13) {
        let prdline = {
          name:this.state.text
        };
        if(this.props.item.id) {
          prdline = {
            ...prdline,
            id: this.props.item.id
          }
        }
        this.props.onEnter(prdline);
        this.setState({
          editting: false,
          text: ''
        })
      }
    }

    delete(e) {
      e.stopPropagation();
      this.props.deleteProductLine(Object.assign({}, this.props.item));
    }

    render(){
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        const item = this.props.item
        // console.log(this.props)
        return (
          <Card className={classes.card} onClick={() => { this.edit() }}>
            <CardContent>
              <NewProductLine
                editting={this.state.editting}
                classes={classes}
                item={item}
                text={this.state.text}
                onTextChange={(e) => { this.textChange(e) }}
                onTextEnter={(e) => { this.onEnter(e) }}
              >
              </NewProductLine>
              <DeleteProductLine
                editable={this.props.editable}
                persistent={this.props.persistent}
                classes={classes}
                onClick={(e) => { this.delete(e) }}
              >
              </DeleteProductLine>
            </CardContent>
          </Card>
        );
    }
}

function DeleteProductLine(props) {
  const { classes } = props;
  if(props.editable && props.persistent) {
    return (
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        className={classes.button + ' ' + classes.close_button}
        onClick={(e)=>{props.onClick(e)}}
      >
        <CloseIcon />
      </IconButton>
    );
  }
  return null;
}

function NewProductLine(props) {
  const { classes, item } = props;
  if(props.editting && item) {
    return (
      <TextField
          id="standard-bare"
          className={classes.textField}
          margin="dense"
          fullWidth
          value={props.text}
          onChange={props.onTextChange}
          onKeyPress={(e)=>{props.onTextEnter(e)}}
          autoFocus
      />
    );
  }
  return (
    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
      {item.name}
    </Typography>
  );
}

ManufacturingGoalsCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManufacturingGoalsCard);