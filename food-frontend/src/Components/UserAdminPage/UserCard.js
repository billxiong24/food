
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = {
  card: {
    width: '100 %',
    marginBottom:10,
    marginTop:10,
    padding:10,
  },
  content: {
    display:'flex',
    flexDirection:'row',
    padding:'0px !important',
  },
  user_name: {
    fontSize: 14,
    display:'flex',
    flexGrow:'8',
    marginTop:'auto',
    marginBottom:'auto',
  },
  admin_switch: {

  },
  close_button: {
    float:'right',
    padding:'0px',
  }
};

class UserCard extends Component {
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

    delete(e) {
      e.stopPropagation();
      this.props.deleteProductLine(Object.assign({}, this.props.item));
    }

    render(){
        const { classes } = this.props;
        const item = this.props.item
        // console.log(this.props)
        return (
          <Card className={classes.card}>
            <CardContent onClick={() => {this.props.selectToEdit(item)}} className={classes.content}>
              <Typography className={classes.user_name} color="textSecondary" gutterBottom>
                {item.uname}
              </Typography>
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.button + ' ' + classes.close_button}
                onClick={(e) => { e.stopPropagation(); this.props.delete(item) }}
                disabled={item.uname === "admin" || item.uname === this.props.currentUser }
              >
                <CloseIcon />
              </IconButton>
            </CardContent>
          </Card>
        );
    }
}

export default withStyles(styles)(UserCard);