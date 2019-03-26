import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Button, Input } from '@material-ui/core';
import InputAutocomplete from './InputAutocomplete';
import DetailView from '../GenericComponents/DetailView';
import UnitSelect from '../GenericComponents/UnitSelect';
import InputSelect from '../GenericComponents/InputSelect';
import InputAutoCompleteOpenPage from '../GenericComponents/InputAutoCompleteOpenPage';
import { resolveAny } from 'dns';
import { resolve } from 'path';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: "flex",
    flexDirection: 'row',
    minWidth:400
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'inline',
  },
  suggestionsList: {  
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  button: {
      height: 35,
      marginTop: "auto",
      marginBottom: 10,
      marginRight: 10,
      marginLeft: 10
  },
});

class InputAutocompleteOpenPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      newItem:false,
      editDialog:false,
      createDialog:false,
      name: this.props.defaultValue
    };
  }

//   handleSuggestionsFetchRequested = ({ value }) => {
//     this.setState({
//       suggestions: getSuggestions(value),
//     });
//   };

//   handleSuggestionsClearRequested = () => {
//     this.setState({
//       suggestions: [],
//     });
//   };

//   handleChange = name => (event, { newValue }) => {
//     this.setState({
//       [name]: newValue,
//     });
//   };


getSuggestionsFromApi = (value) => {
    this.props.suggestionsCallback(value).then((res) => {
      // // console.log(suggestions)
    // // console.log(value)
    let suggestions = res
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    // // console.log(suggestions.filter(suggestion => {
    //     const keep =
    //       count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

    //     if (keep) {
    //       count += 1;
    //     }

    //     return keep;
    //   }))
  
    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
  
          if (keep) {
            count += 1;
          }
  
          return keep;
        }); 
    })
  }

  suggestionsCallback = (value) => {
    this.props.suggestionsCallback(value).then((res) => {
      // // console.log(suggestions)
    // // console.log(value)
    let suggestions = res
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    // // console.log(suggestions.filter(suggestion => {
    //     const keep =
    //       count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

    //     if (keep) {
    //       count += 1;
    //     }

    //     return keep;
    //   }))
  
    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
  
          if (keep) {
            count += 1;
          }
  
          return keep;
        }); 
    })
  }

//  suggestionsCallback = (value) => {
//     this.getSuggestionsFromApi(value).then(function(res){
//       // console.log(res)
//       return res
//     }
//     )
// }


  newItemCallBack = (isNew) => {
    this.setState({
        newItem: isNew,
    });
  }

  render() {
    const { classes } = this.props;
    // console.log(this.props)

    return (
        <div className={classes.container}>
            <InputAutocomplete
                id="sku_prd_line"
                item="prod1"
                items={["prod1","prod2","prod3"]}
                name={this.props.name}
                onChange={(value) => {
                  this.setState({name: value})
                  this.props.onChange(value)
                }}
                handleChange={(value) => {
                  this.setState({name: value})
                  
                }}
                handleChangerino={(value) => {
                  this.setState({namerino: value})
                  if(this.props.handleChangerino){
                    this.props.handleChangerino(value)
                  }
                }}
                defaultValue={this.props.defaultValue}
                error={this.props.error}
                newItemCallBack={this.newItemCallBack}
                idCallback={(id) => {
                    this.props.handleChange(id)
                    this.props.idCallback(id)
                  }
                }
                defaultId = {this.props.defaultId}
                suggestionsCallback={this.suggestionsCallback}
                className={classes.autocomplete}
            />
            {
                this.state.name ?
                <Button
                    color="primary"
                    className={classes.button}
                    onClick={()=>{
                        this.props.openEditPage(() => { this.setState({ editDialog: null })})
                        .then((res) => {
                          this.setState({editDialog: res})
                        })
                    }}
                    > 
                    Edit
                </Button>
                :
                <Button
                    className={classes.button}
                    onClick={()=>{
                      this.props.openCreatePage(() => { this.setState({ createDialog: null })}, this.state.namerino)
                      .then((res) => {
                        this.setState({createDialog: res})
                      })
                  }}
                    >
                    Create
                </Button>

            }
            {
                this.state.editDialog
            }
            {
                this.state.createDialog
            }
            {/* <DetailView
                open={this.state.editDialog}
                close={() => {
                    this.setState({ editDialog: false });
                    }}
                submit={(e) => // console.log(e)}
                handleChange={() => // console.log("handle change")}
                name={"Ingredient Name"}
                shortname={"Ingredient Short Name"}
                comment={"Ingredient Comment"}
                title={"Ingredient"}
            >
                <Input
                    id="ing_name"
                    rows="4"
                    name={"Name"}
                    value={()=>// console.log("hello")}
                />
                <Input
                    id="ing_number"
                    rows="4"
                    type="number"
                    name={"Number"}
                    value={()=>// console.log("hello")}
                />
                <Input
                    id="ing_vend_info"
                    rows="4"
                    name={"Vendor Info"}
                    value={()=>// console.log("hello")}
                />
                <UnitSelect
                    id="ing_pkg_size"
                    unitSelect={true}
                    name={"Package Size"}
                    item="kg"
                    items={["kg","g","grams"]}
                />
                <Input
                    id="ing_pkg_cost"
                    rows="4"
                    type="number"
                    name={"Package Cost"}
                    value={()=>// console.log("hello")}
                />
                <Input
                    id="ing_pkg_cost"
                    rows="4"
                    multiline
                    type="number"
                    name={"Comment"}
                    value={()=>// console.log("hello")}
                />
                <InputAutoCompleteOpenPage
                    id="sku_prd_line"
                    item="prod1"
                    items={["prod1","prod2","prod3"]}
                    name={"Product Line"}
                />
                <InputSelect
                    id="sku_prd_line"
                    item="prod1"
                    items={["prod1","prod2","prod3"]}
                    name={"Product Line"}
                /> 
            </DetailView> */}
        </div>
    );
  }
}

InputAutocompleteOpenPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputAutocompleteOpenPage);