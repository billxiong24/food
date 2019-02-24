import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { ingDetUpdateIng, ingDetAddIng } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { routeToPage, ingDeleteIng } from '../../Redux/Actions';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import FileDownload from 'js-file-download';
import common, { isSKUCSV, createError, isIngredientCSV, isFormulaCSV, isProductLineCSV } from '../../Resources/common';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { CardActionArea } from '@material-ui/core';
import { bulkImportAddError, bulkImportDeleteError } from '../../Redux/Actions/ActionCreators/BulkImportActionCreators';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';



const styles = {
    ingredient_page_container:{
        display:'flex',
        flexDirection: 'row',
    },
    bulk_import_page:{
        display:'flex',
        flexDirection: 'column',
    },
    file_upload_container:{
        backgroundColor: labels.colors.primaryColor,
        borderRadius: 12
    },
    updateItemContainer:{
        backgroundColor: 'rgb(255,255,255,0.23)'
    },
    updateItemText:{
        color: 'white'
    },
    ingredient_detail_view:{    
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px',
        backgroundColor: 'rgb(255,255,255,0.23)',
        borderRadius: 12,
        color:'white'
    },
    textField:{
        width: '500px',
        color:'white'
    },
    text:{
        width: '500px',
        color:'white'
    },
    button:{
        width: '300px',
        backgroundColor: 'rgb(255,255,255,0.23)',
        color:'white'
    },
    input: {
        display: 'none',
    },
    card: {
        width: '100 %',
        marginBottom:20,
        marginTop:20,
      },
      cardAction:{
        padding:10
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

};

class BulkImportPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            ingredientErrors:[],
            ingredientUpdates:[],
            skuErrors:[],
            skuUpdates:[],
            formulaErrors:[],
            formulaUpdates:[],
            productLineErrors:[],
            productLineUpdates:[],
            errors:[]
        }
    }


    componentWillMount() {

    }


    skuUpload = file => {
        if (file === undefined ){
            return
        }
        if(!isSKUCSV(file.name)){
            this.props.pushError(createError("Import SKU File Name Format: \'sku*.csv\'"))
            return
        }
        var formData = new FormData();
        formData.append("csvfile", file);
        formData.append("type","sku")
        axios.post(common.hostname + 'bulk/bulk_import', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log("RESPONDED FROM BULK IMPORT");
                if(!response.data.abort){
                    console.log("NOT ABORTING");
                    this.setState({
                        skuErrors:response.data.errors,
                    })
                    if(response.data.rows !== undefined){
                        this.setState({
                            skuUpdates:response.data.rows,
                        })
                    }
                }
                else {
                    this.setState({
                        skuErrors:response.data.errors,
                    })

                }
            })
            .catch(err => {
              console.log(err);
            })
      }

    skuConfirm = () =>{
        console.log(this.state.skuUpdates)
        axios.post(common.hostname + 'bulk/accept_bulk_import', {
            rows: this.state.skuUpdates,
            type: "sku",
          })
            .then((response) => {
                this.setState({
                    skuErrors:[],
                    skuUpdates:[],
                })
            })
            .catch(err => {
              console.log(err);
        })
    }

    productLineUpload = file => {
        if (file === undefined ){
            return
        }
        console.log(file)
        if(!isProductLineCSV(file.name)){
            this.props.pushError(createError("Import Product Line File Name Format: \'product_line*.csv\'"))
            return
        }
        var formData = new FormData();
        formData.append("csvfile", file);
        formData.append("type","productline")
        axios.post(common.hostname + 'bulk/bulk_import', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                if(!response.data.abort){
                this.setState({
                    productLineErrors:response.data.errors,
                })
                if(response.data.rows !== undefined){
                    this.setState({
                        productLineUpdates:response.data.rows,
                    })
                }
            }
            })
            .catch(err => {
              console.log(err);
            })
      }

    productLineConfirm = () =>{
        console.log(this.state.skuUpdates)
        axios.post(common.hostname + 'bulk/accept_bulk_import', {
            rows: this.state.productLineUpdates,
            type: "sku",
          })
            .then((response) => {
                this.setState({
                    productLineErrors:[],
                    productLineUpdates:[],
                })
            })
            .catch(err => {
              console.log(err);
        })
    }

      ingredientUpload = file => {
        if (file === undefined ){
            return
        }
        console.log(file)
        if(!isIngredientCSV(file.name)){
            this.props.pushError(createError("Import Ingredient File Name Format: \'ingredient*.csv\'"))
            return
        }
        var formData = new FormData();
        formData.append("csvfile", file);
        formData.append("type","ingredient")
        console.log("HEYYYYY")
        axios.post(common.hostname + 'bulk/bulk_import', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log("I GOT A RESPONSE FROM ingredient");
                if(response.data === null) {
                    this.setState({
                        ingredientErrors:[{
                            detail: "Successfully imported."
                        }]
                    })  
                    return;
                }
                if(!response.data.abort){
                this.setState({
                    ingredientErrors:response.data.errors,
                })
                if(response.data.rows !== undefined){
                    this.setState({
                        ingredientUpdates:response.data.rows,
                    })  
                }
            }
            })
            .catch(err => {
              console.log(err);
            })
      }

      ingredientConfirm = () =>{
        axios.post(common.hostname + 'bulk/accept_bulk_import', {
            rows: this.state.ingredientUpdates,
            type: "ingredient",
          })
            .then((response) => {
                this.setState({
                    ingredientErrors:[],
                    ingredientUpdates:[],
                })
            })
            .catch(err => {
              console.log(err);
        })
    }

      formulaUpload = file => {
        console.log(file)
        if (file === undefined ){
            return
        }
        if(!isFormulaCSV(file.name)){
            this.props.pushError(createError("Import Formula File Name Format: \'formula*.csv\'"))
            return
        }
        var formData = new FormData();
        formData.append("csvfile", file);
        formData.append("type","formula")
        axios.post(common.hostname + 'bulk/bulk_import', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log("I GOT A RESPONSE FROM FORMULA");
            if(response.data === null) {
                this.setState({
                    formulaErrors:[{
                        detail: "Successfully imported."
                    }]
                })  
                return;
            }
            if(!response.data.abort){
                this.setState({
                    formulaErrors:response.data.errors,
                })
                if(response.data.rows !== undefined){
                    this.setState({
                        formulaUpdates:response.data.rows,
                    })  
                }
            }
            else {
                this.setState({
                    formulaErrors: response.data.errors
                })
            }
        })
        .catch(err => {
          console.log(err);
        })
      }

      formulaConfirm = () =>{
        axios.post(common.hostname + 'bulk/accept_bulk_import', {
            rows: this.state.formulaUpdates,
            type: "formula",
          })
            .then((response) => {
                this.setState({
                    formulaErrors:[],
                    formulaUpdates:[],
                })
            })
            .catch(err => {
              console.log(err);
        })
    }

    
    render() {
        const { classes } = this.props
        console.log(this.state)
        console.log(this.state.skuUpdates.length)
        return (
            <div className={classes.bulk_import_page}>
            <Typography>
                We are using Indivial Mode (please refer to the Bulk Import Specifications)
            </Typography>
            <a href="Bulk_Import_Specifications.pdf" download="Bulk_Import_Specifications.pdf">Click to Download Bulk Import Specifications</a>
            <a href="skus.csv" download="skus.csv">Click to Download Sample SKUs CSV</a>
            <a href="formulas.csv" download="formulas.csv">Click to Download Sample Formulas CSV</a>
            <a href="ingredients.csv" download="ingredients.csv">Click to Download Sample Ingredients CSV</a>
            <a href="product_lines.csv" download="product_lines.csv">Click to Download Sample Product Lines CSV</a>
                <div className={classes.file_upload_container}>
                    <input
                        accept=".csv"
                        className={classes.input}
                        id="contained-button-file1"
                        type="file"
                        name="csvfile"
                        onChange={e => this.skuUpload(e.target.files[0])}
                    />
                    <label htmlFor="contained-button-file1">
                        <Button variant="contained" component="span" className={classes.button}>
                            Upload SKU CSV
                        </Button>
                    </label>
                    {
                        this.state.skuErrors.map((error, index) => (
                            <div className={classes.updateItemContainer}>
                                <Typography className={classes.updateItemText}>
                                    {error.detail}
                                </Typography>
                            </div>      
                        ))
                    }
                    {
                        this.state.skuUpdates.map((update, index) => (
                            <Card className={classes.card} key={index}>
                                <CardContent onClick={console.log("")}>
                                    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                        {update.name}
                                    </Typography>
                                    <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                                        {update.num}
                                    </Typography>
                                </CardContent>
                            </Card>     
                        ))
                    }
                    {
                        this.state.skuUpdates.length > 0?
                        <Button variant="contained" component="span" className={classes.button} onClick={this.skuConfirm}>
                            Confirm Changes
                        </Button>
                        :
                        <div></div>

                    }
                </div>
                <div className={classes.file_upload_container}>
                        <input
                            accept=".csv"
                            className={classes.input}
                            id="contained-button-file2"
                            type="file"
                            name="csvfile"
                            onChange={e => this.formulaUpload(e.target.files[0])}
                        />
                        <label htmlFor="contained-button-file2">
                            <Button variant="contained" component="span" className={classes.button}>
                            Upload Formula CSV
                            </Button>
                        </label>
                    {
                        this.state.formulaErrors.map((error, index) => (
                            <div className={classes.updateItemContainer}>
                                <Typography className={classes.updateItemText}>
                                    {error.detail}
                                </Typography>
                            </div>      
                        ))
                    }
                    {
                        this.state.formulaUpdates.map((update, index) => (
                            <Card className={classes.card} key={index}>
                                <CardContent onClick={console.log("")}>
                                    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                        {update.name}
                                    </Typography>
                                    <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                                        {update.num}
                                    </Typography>
                                </CardContent>
                            </Card>     
                        ))
                    }
                    {
                        this.state.formulaUpdates.length > 0?
                        <Button variant="contained" component="span" className={classes.button} onClick={this.formulaConfirm}>
                            Confirm Changes
                        </Button>
                        :
                        <div></div>

                    }
                </div>
                <div className={classes.file_upload_container}>
                    <input
                        accept=".csv"
                        className={classes.input}
                        id="contained-button-file3"
                        type="file"
                        name="csvfile"
                        onChange={e => this.ingredientUpload(e.target.files[0])}
                    />
                    <label htmlFor="contained-button-file3">
                        <Button variant="contained" component="span" className={classes.button}>
                        Upload Ingredient CSV
                        </Button>
                    </label>
                    {
                        this.state.ingredientErrors.map((error, index) => (
                            <div className={classes.updateItemContainer}>
                                <Typography className={classes.updateItemText}>
                                    {error.detail}
                                </Typography>
                            </div>      
                        ))
                    }
                    {
                        this.state.ingredientUpdates.map((update, index) => (
                            <Card className={classes.card} key={index}>
                                <CardContent onClick={console.log("")}>
                                    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                        {update.name}
                                    </Typography>
                                    <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                                        {update.num}
                                    </Typography>
                                </CardContent>
                            </Card>     
                        ))
                    }
                    {
                        this.state.ingredientUpdates.length > 0?
                        <Button variant="contained" component="span" className={classes.button} onClick={this.ingredientConfirm}>
                            Confirm Changes
                        </Button>
                        :
                        <div></div>

                    }
                </div>
                <div className={classes.file_upload_container}>
                        <input
                            accept=".csv"
                            className={classes.input}
                            id="contained-button-file4"
                            type="file"
                            name="csvfile"
                            onChange={e => this.productLineUpload(e.target.files[0])}
                        />
                        <label htmlFor="contained-button-file4">
                            <Button variant="contained" component="span" className={classes.button}>
                            Upload Product Line CSV
                            </Button>
                        </label>
                    {
                        this.state.productLineErrors.map((error, index) => (
                            <div className={classes.updateItemContainer}>
                                <Typography className={classes.updateItemText}>
                                    {error.detail}
                                </Typography>
                            </div>      
                        ))
                    }
                    {
                        this.state.productLineUpdates.map((update, index) => (
                            <Card className={classes.card} key={index}>
                                <CardContent onClick={console.log("")}>
                                    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                        {update.name}
                                    </Typography>
                                    <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                                        {update.num}
                                    </Typography>
                                </CardContent>
                            </Card>     
                        ))
                    }
                    {
                        this.state.productLineUpdates.length > 0?
                        <Button variant="contained" component="span" className={classes.button} onClick={this.productLineConfirm}>
                            Confirm Changes
                        </Button>
                        :
                        <div></div>

                    }
                </div>
                {
                    this.props.errors.map((error, index) => (
                        <SimpleSnackbar
                        open={true} 
                        handleClose={()=>{this.props.deleteError(error)}}
                        message={error.errMsg}
                        >
                        </SimpleSnackbar>
                    ))
                }
                            
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        errors: state.bulk_import.errors
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        pushError: err => {
            dispatch(bulkImportAddError(err))
            setTimeout(function(){dispatch(bulkImportDeleteError(err))}, 2000);
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(BulkImportPage)));
