import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import FilterList from './FilterList';
import SKUList from './SKUList';
import FilterDropdown from './FilterDropdown';
import SortByDropdown from './SortByDropdown';
import PageSelector from './PageSelector';
import SKUsPageSearchBar from './SKUsPageSearchBar';
import { withRouter } from 'react-router-dom'
import { skuDetSetSku, skuDetGetProductLine, skuDetSetNew, skuDetSetEditing } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import { skuDeleteError } from '../../Redux/Actions';
import { skuAddAllSelected, skuRemoveAllSelected } from '../../Redux/Actions/index';
import axios from 'axios';
import FileDownload from 'js-file-download';
import common from '../../Resources/common';
import { withCookies } from 'react-cookie';
import BulkEditDialog from './BulkEditDialog';
import { manlineGetMappings, manlineResetMapping, manlineUpdateMappings } from '../../Redux/Actions/ActionCreators/ManufacturingLineActionCreators';

const styles = {
  card: {
    width: '100 %',
    margin: 20,
    padding: 10
  },
  SKUs_page_container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    display: 'flex'
  },
  SKUs_list_container: {
    height: '100%',
    width: '73%',
    float: 'right',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center'
  },
  SKUs_list: {
    height: '80vh',
    width: '100%',
    margin: 5,
    padding: 5,
    overflow: 'auto'
  },
  filters_list: {
    overflow: 'auto'
  },
  active_filters_container: {
    height: '85vh',
    width: '23%',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: 12,
    backgroundColor: '#6F3AD3',
    flexDirection: 'column',
    display: 'flex',
    borderRadius: 12,
    overflow: 'auto'
  },
  active_filters_container_title: {
    color: 'white',
    fontSize: '16px',
    float: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    textAlign: 'left',
    margin: 8
  },
  SKUs_list_divider: {
    width: '90%',
    backgroundColor: 'gray',
    height: '2px',
    margin: 10
  },
  page_number_text: {
    color: 'gray',
    margin: 5
  },
  SKUs_search_bar: {
    flexDirection: 'row',
    display: 'flex'
  },
  page_selection_container: {
    flexDirection: 'row',
    display: 'flex'
  },
  button: {
  },
  input: {
    display: 'none',
  },
  autosuggest: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 300
  },
  other_actions: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex'
  },
  add_ingredient: {
    marginRight: 'auto'
  },
  export_to_csv: {
    marginLeft: 'auto'
  }
};

class SKUsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bulkEditDialog: false,
    }
  }

  componentWillMount() {
  }

  onAddClick = () => {
    this.props.setSKU(this.props.history)
  }

  onExportClick = () => {
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.props.items.map((sku) => ({
        id: sku.id,
        num: sku.num,
        name: sku.name,
        case_upc: sku.case_upc,
        unit_upc: sku.unit_upc,
        unit_size: sku.unit_size,
        count_per_case: sku.count_per_case,
        prd_line: sku.prd_line,
        formula_id: sku.formula_id,
        man_rate: sku.man_rate,
        formula_scale: sku.formula_scale,
        comments: sku.comments
      })),
      format: "csv",
      type: "sku"
    })
      .then((response) => {
        FileDownload(response.data, 'skus.csv');
      })
      .catch(err => {
        console.log(err);
      })
  }

  openBulkEdit() {
    this.props.manlineGetMappings(this.props.selected);
    this.setState({ bulkEditDialog: true })
  }

  closeBulkEdit() {
    this.props.manlineResetMapping();
    this.setState({ bulkEditDialog: false })
  }

  submitBulkEdit = () => {
    this.props.manlineUpdateMappings();
    this.closeBulkEdit();
  }


  render() {
    const { classes, dummy_SKUs } = this.props
    return (
      <div className={classes.SKUs_page_container}>
        <Card className={classes.active_filters_container}>
          <Typography className={classes.active_filters_container_title}>
            Search Bar Filter Type
        </Typography>
          <FilterDropdown></FilterDropdown>
          <Typography className={classes.active_filters_container_title}>
            Sort By
          </Typography>
          <SortByDropdown></SortByDropdown>
          <Typography className={classes.active_filters_container_title}>
            Active Filters
          </Typography>
          <FilterList></FilterList>
        </Card>
        <div className={classes.SKUs_list_container}>
          <div className={classes.SKUs_list}>
            <SKUsPageSearchBar></SKUsPageSearchBar>
            <div className={classes.SKUs_search_bar}>
            </div>
            <div className={classes.other_actions}>
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={this.onAddClick}>
                    Add SKU
                  </Button>
                  :
                  <div></div>
              }
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={() => { this.props.addAllFilter() }}
                  >
                    Select All
                  </Button>
                  :
                  <div></div>
              }
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={() => { this.props.removeAllFilter() }}
                  >
                    Remove All
                  </Button>
                  :
                  <div></div>
              }
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={() => { this.openBulkEdit() }}
                  >
                    Bulk Edit Manufacturing Line
                  </Button>
                  :
                  <div></div>
              }
              <BulkEditDialog
                open={this.state.bulkEditDialog}
                close={() => { this.closeBulkEdit() }}
                submit={this.submitBulkEdit}
              />
              <Button
                className={classes.export_to_csv}
                onClick={this.onExportClick}
              >
                Export to CSV
            </Button>
            </div>
            <SKUList></SKUList>
          </div>
          <div variant="inset" className={classes.SKUs_list_divider} />
          <PageSelector></PageSelector>
        </div>
        {
          this.props.errors.map((error, index) => (
            <SimpleSnackbar
              open={true}
              handleClose={() => { this.props.deleteError(error) }}
              message={error.errMsg}
            >
            </SimpleSnackbar>
          ))
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dummy_SKUs: state.dummy_SKUs,
    errors: state.skus.errors,
    items: state.skus.items,
    cookies: ownProps.cookies.cookies,
    selected: state.skus.selectedSkus,
    manline: state.manLine,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteError: (error) => {
      dispatch(skuDeleteError(error))
    },
    setSKU: (history) => {
      Promise.resolve(dispatch(skuDetGetProductLine())) // dispatch
        .then(function (response) {
          dispatch(skuDetSetSku({
            manufacturing_lines: [],
            formula_id: null,
            name: "",
            case_upc: null,
            unit_upc: null,
            unit_size: "",
            count_per_case: null,
            prd_line: "",
            comments: "",
            id: null
          }))
          dispatch(skuDetSetNew(true))
          dispatch(skuDetSetEditing(true))
          history.push('/skus/details')

          return response;
        })
        .then(function (response) { console.log("@RESPONSE", response) })
    },
    addAllFilter: () => { dispatch(skuAddAllSelected()) },
    removeAllFilter: () => { dispatch(skuRemoveAllSelected()) },
    manlineGetMappings: (skus) => {
      dispatch(manlineGetMappings(skus));
    },
    manlineResetMapping: () => {
      dispatch(manlineResetMapping());
    },
    manlineUpdateMappings: () => {
      dispatch(manlineUpdateMappings());
    }
  }
}


export default withRouter(withStyles(styles)(withCookies(connect(mapStateToProps, mapDispatchToProps)(SKUsPage))));
