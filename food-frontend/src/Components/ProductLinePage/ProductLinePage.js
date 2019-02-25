import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ItemList from '../GenericComponents/ItemList';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import ProductLineCard from './ProductLineCard';
import Fab from '@material-ui/core/Fab';
import { prdlineChangeLimit, prdlineNextPage, prdlinePrevPage, 
  prdlineSearch, prdlineAddPrdline, prdlineUpdatePrdline, 
  prdlineDeletePrdline } from '../../Redux/Actions/ActionCreators/ProductLineActionCreators'
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import { IconButton } from '@material-ui/core';
import common from '../../Resources/common';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { withCookies } from 'react-cookie';

const styles = {
  ingredients_list:{
    height: '100%',
    width: '65%',
    margin: 'auto',
    padding: 5,
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
    'text-align':'left',
    display:'flex',
    flexDirection:'row',
  },
  search_bar:{
    width: '80%',
    display:'inline-flex'
  },
  query_button:{
    display:'inline-flex',
    width: '6%',
    'padding-left':'2%',
    marginTop:15,
  },
  list_container:{
    overflow:'auto',
  },
  hide: {
    display:'none'
  },
  page_selection_container: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '30%',
    paddingRight: '30%',
  },
  page_number_text: {
    fontSize: '14px',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    margin:'auto',
  },
  button: {
    margin:'auto',
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
    this.handleQuery();
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
    this.props.prdlineSearch(this.state.query);
  }

  addProductLine(prdline){
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

  incrementPage() {
    this.props.prdlineNextPage();
    this.handleQuery();
  }

  decrementPage() {
    this.props.prdlinePrevPage();
    this.handleQuery();
  }

  changeLimit(val) {
    this.props.prdlineChangeLimit(val);
    this.handleQuery();
  }

  onExportClick = () => {
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.props.productLine.productLines.map((e)=>{
        return {
          name: e.name,
        }
      }),
      format: "csv",
      type: "productline"
    })
      .then((response) => {
        FileDownload(response.data, 'product_lines.csv');
      })
      .catch(err => {
        console.log(err);
      })
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
                onChange={(e) => { this.handleQueryChange(e) }}
                onKeyPress={(e) => { this.handleEnter(e) }}
              />
            </div>
            <div className={classes.query_button}>
              <Fab
                variant="extended"
                aria-label="Delete"
                className={classes.fab}
                onClick={(e) => { this.handleQuery() }}
              >
                Search
              </Fab>
            </div>
            <div className={classes.query_button}>
              <Fab
                variant="extended"
                aria-label="Delete"
                className={classes.fab}
                onClick={this.onExportClick}
                disabled={productLine.productLines.length === 0}
              >
                Export Search
              </Fab>
            </div>
          </div>
          <DisplayButton
          classes={classes}
          limit={productLine.limit}
          changeLimit={(val)=>this.changeLimit(val)}
          >
          </DisplayButton>
          <NewProductLine
            addProductLine={(prdline) => { this.addProductLine(prdline) }}
            admin={this.props.cookies.admin}
            classes={classes}
          ></NewProductLine>
          <div className={classes.list_container}>
            <ItemList items={productLine.productLines}>
              <ProductLineCard
                onEnter={(prdline) => { this.updateProductLine(prdline) }}
                editable={this.props.cookies.admin === "true"}
                persistent={true}
                deleteProductLine={(prdline) => { this.removeProductLine(prdline) }}
              ></ProductLineCard>
            </ItemList>
          </div>

          <div className={(productLine.productLines.length === 0 || !productLine.limit) ? classes.hide : ''}>
            <div variant="inset" className={classes.ingredients_list_divider} />
            <div className={classes.page_selection_container}>
              <IconButton color="primary" className={classes.button} onClick={()=>{this.decrementPage()}}>
                <img src={back} />
              </IconButton>
              <Typography className={classes.page_number_text}>
                Page {productLine.current_page_number} of {productLine.total_pages}
              </Typography>
              <IconButton color="primary" className={classes.button} onClick={()=>{this.incrementPage()}}>
                <img src={next} />
              </IconButton>
            </div>
          </div>
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

function DisplayButton(props) {
  const { classes } = props
  if(props.limit) {
    return (
      <Button variant="contained" className={classes.button} onClick={()=>props.changeLimit(null)}>
        Show All Entries
      </Button>
    )
  } else {
    return (
      <Button variant="contained" className={classes.button} onClick={()=>props.changeLimit(10)}>
        Show 10 Entries Per Page
      </Button>
    )
  }
}

function NewProductLine(props) {
  if(props.admin==="true") {
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


const mapStateToProps = (state, ownProps) => {
  return {
    productLine: state.productLine,
    cookies: ownProps.cookies.cookies,
  };
};

const mapDispatchToProps = {
  prdlineSearch,
  prdlineAddPrdline,
  prdlineDeletePrdline,
  prdlineUpdatePrdline,
  prdlineNextPage,
  prdlinePrevPage,
  prdlineChangeLimit,
};


export default withStyles(styles)(withCookies(connect(mapStateToProps,mapDispatchToProps)(ProductLinePage)));
