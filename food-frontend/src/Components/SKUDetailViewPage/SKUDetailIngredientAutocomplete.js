import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest2 from '../GenericComponents/IntegrationAutosuggest2';
import labels from '../../Resources/labels';
import { ingAddFilter, ingSearch, ingGetSkus } from '../../Redux/Actions';
import { skuFormatter } from '../../Scripts/Formatters';
import { skuDetDeleteManLine, skuDetGetManLinesAuto, skuDetSetLines, skuDetGetFormulaNames,  skuDetGetIng, skuDetIngAutocomplete, skuDetAddIngLocal , skuDetSetFormula } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import TextField from '@material-ui/core/TextField';
import SimpleCard from '../GenericComponents/SimpleCard';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { CardActionArea } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    autosuggest:{
        fontSize: 14,
        fontFamily: 'Open Sans',
        fontWeight: 300,
        paddingBottom: 3
    },
    search:{
        marginBottom: 5
    },
    container:{
        width: '100%',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'baseline'
    }
};

class SKUDetailIngredientAutocomplete extends Component {

    constructor(props){
        super(props);
        this.props.getIngredientNames("")
        this.state ={
            quantity: 1
        }
    }


    componentWillMount() {

    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    

    onIngredientFilterEnter = (input) => {
        
    }
    
    onIngredientFilterSuggest = (input, num) => {
        num.quantity = this.state.quantity
        this.props.addForm(num)
        this.setState({
            quantity: 1
        })
    }
    onLineFilterSuggest = (input, num) => {
        this.props.addLine(num)
    }

    onChange = (input) => {
        this.props.getFormulaNames(input)
    }
    onLineChange = (input) => {
        this.props.getLines(input)
    }
    deleteManLine(item) {
        console.log("deeteteletleing");
        console.log(item);
        console.log(this.props.id);

        this.props.deleteLine(this.props.id, item);
    }

    render() {
        const { classes, current_formula, formula_names, manufacturing_lines, manline_suggestions, filter_type, editing } = this.props
        return (
            editing ?
            <div className={classes.container}>
                <IntegrationAutosuggest2
                    className={classes.autosuggest}
                    suggestions={formula_names.map(formula => ({label:formula.name, id:formula.id, item: formula}))}
                    placeholder={"Add Formula"}
                    onEnter = {this.onIngredientFilterEnter}
                    onSuggest = {this.onIngredientFilterSuggest}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest2>
            <Card className={classes.card}>
            <div>FORMULA</div>
            <div>Name: {current_formula ? current_formula.name : ""} </div>
            <div>Num: {current_formula ? current_formula.num : ""} </div>
                
                <CardContent >
                </CardContent>
                
            </Card>
                <IntegrationAutosuggest2
                    className={classes.autosuggest}
                    suggestions={manline_suggestions.map(ml => ({label:ml.name, id:ml.id, item: ml}))}
                    placeholder={"Add Manufacturing Line"}
                    onEnter = {this.onIngredientFilterEnter}
                    onSuggest = {this.onLineFilterSuggest}
                    onChange = {this.onLineChange}
                ></IntegrationAutosuggest2>
            <br/>
            <div>
            {
                manufacturing_lines.map((item, index) => (
                    <Card className={classes.card} key={index}>
                        <CardActionArea
                        className = {classes.cardAction}
                        >
                        <CardContent>
                            <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                    {item.shortname}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                            <Button onClick={() => this.deleteManLine(item)}>
                                Delete
                            </Button>
                    </Card>

                ))
            }
            
            </div>
            </div>
            
            :
            <div></div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredient_names: state.sku_details.ingredient_suggestions,
        formula_names: state.sku_details.formula_suggestions,
        manufacturing_lines: state.sku_details.manufacturing_lines,
        manline_suggestions: state.sku_details.manline_suggestions,
        current_formula: state.sku_details.current_formula,
        id: state.sku_details.id
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getIngredientNames: name => dispatch(skuDetIngAutocomplete(name)),
        getFormulaNames: name => dispatch(skuDetGetFormulaNames(name)),
        addForm: form => dispatch(skuDetSetFormula(form)),
        addLine: form => dispatch(skuDetSetLines(form)),
        getLines: name => dispatch(skuDetGetManLinesAuto(name)),
        deleteLine: (sku_id, item) => dispatch(skuDetDeleteManLine(sku_id, item))
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUDetailIngredientAutocomplete));
