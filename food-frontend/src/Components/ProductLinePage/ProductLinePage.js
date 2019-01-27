import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SimpleList from '../GenericComponents/ItemList';
import ItemList from '../GenericComponents/ItemList';
import IntegrationReactSelect from '../GenericComponents/IntegrationReactSelect';
import { purple } from '@material-ui/core/colors';
import color from '@material-ui/core/colors/cyan';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import ProductLineCard from './ProductLineCard';
import Fab from '@material-ui/core/Fab';
import labels from '../../Resources/labels'
import { prdlineSearch, prdlineAddPrdline, prdlineUpdatePrdline, prdlineDeletePrdline } from '../../Redux/Actions/index'
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';

const styles = {
  ingredients_list:{
    height: '85vh',
    width: '65%',
    margin: 'auto',
    padding: 5,
    overflow: 'auto'
  },
  ingredients_list_divider:{
    width:'100%',
    backgroundColor:'gray',
    height:'2px'
  },
  page_number_text:{
    color:'gray',
    margin: 5
  },
  top_section:{
    width: '100%',
    'text-align':'left'
  },
  search_bar:{
    width: '90%',
    display:'inline-flex'
  },
  query_button:{
    display:'inline-flex',
    width: '6%',
    'padding-left':'2%',
    'padding-right':'2%',
  }
};

class ProductLinePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      alert: false,
      message: ''
    }
  }

  componentWillMount(){
  }

  handleQueryChange(e){
    this.setState({
      query: e.target.value
    });
  }

  handleEnter(e){
    if(e.which === 13 || e.keyCode === 13) {
      this.handleQuery();
    }
  }

  handleQuery(){
    if(this.state.query) {
      this.props.prdlineSearch(this.state.query.slice());
    }
  }

  addProductLine(prdline){
    delete prdline.oldname; // TODO: until api relies on id instead of name
    this.props.prdlineAddPrdline(prdline)
    .then(()=>{
      if(!this.props.productLine.errMsg) {
        this.setState({
          alert: true,
          message: 'Product Line Successfully Added!'
        })
      } else {
        this.setState({
          alert: true,
          message: 'Product Line NOT Added: ' + this.props.productLine.errMsg
        })
      }
    })
  }

  updateProductLine(prdline){
    this.props.prdlineUpdatePrdline(prdline)
    .then(()=>{
      if(!this.props.productLine.errMsg) {
        this.setState({
          alert: true,
          message: 'Product Line Successfully Changed!'
        })
      } else {
        this.setState({
          alert: true,
          message: 'Product Line NOT Changed: ' + this.props.productLine.errMsg
        })
      }
    })
  }

  removeProductLine(prdline){
    this.props.prdlineDeletePrdline(prdline)
    .then(()=>{
      if(!this.props.productLine.errMsg) {
        this.setState({
          alert: true,
          message: 'Product Line Successfully Removed!'
        });
        // this.handleQuery();
      } else {
        this.setState({
          alert:true,
          message: 'Product Line NOT Deleted: ' + this.props.productLine.errMsg
        });
      }
    });
  }

  closeAlert() {
    this.setState({
      alert: false,
      message: ''
    });
  }


  render() {
    const { classes, productLine } = this.props
    return (
      <div>
        <div className={classes.ingredients_list}>
          <div className={classes.top_section}>
            <div className={classes.search_bar}>
              <TextField
              id="outlined-search"
              label="Search Product Line"
              type="search"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              fullWidth
              value={this.state.query}
              onChange={(e)=>{this.handleQueryChange(e)}}
              onKeyPress={(e)=>{this.handleEnter(e)}}
              />
            </div>
            <div className={classes.query_button}>
              <Fab
              variant="extended" 
              aria-label="Delete" 
              className={classes.fab}
              onClick={(e)=>{this.handleQuery()}}
              >
                Search
              </Fab>
            </div>
          </div>
          
          <NewProductLine
            addProductLine={(prdline) => { this.addProductLine(prdline) }}
            uname={this.props.users.uname}
            classes={classes}
          ></NewProductLine>

          <ItemList items={ productLine.productLines }>
            <ProductLineCard 
            onEnter={(prdline) =>{ this.updateProductLine(prdline) }}
            editable={this.props.users.uname === labels.users.ADMIN}
            persistent={true}
            deleteProductLine={(prdline) => { this.removeProductLine(prdline)}}
            ></ProductLineCard>
          </ItemList>

          <div variant="inset" className={classes.ingredients_list_divider}/>
          <Typography className={classes.page_number_text}>
            Page {productLine.current_page_number} of {productLine.total_pages}
          </Typography>
        </div>
        <SimpleSnackbar
        open={this.state.alert} 
        handleClose={()=>{this.closeAlert()}}
        message={this.state.message}
        >
        </SimpleSnackbar>
      </div>
    );
  }
}

function NewProductLine(props) {
  if(props.uname===labels.users.ADMIN) {
    return (
      <div>
        <ProductLineCard
          onEnter={props.addProductLine}
          editable={true}
          item={{ name: 'Add New Product Line' }}
          persistent={false}
        ></ProductLineCard>
        <div variant="inset" className={props.classes.ingredients_list_divider} />
      </div>
    );
  }
  return null;
}


const mapStateToProps = state => {
  return {
    productLine: state.productLine,
    users: state.users
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     search: (name) => {
//       prdlineSearch(name);
//     }
//   };
// };


export default withStyles(styles)(connect(mapStateToProps,{prdlineSearch, prdlineAddPrdline, prdlineDeletePrdline, prdlineUpdatePrdline})(ProductLinePage));