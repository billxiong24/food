import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Icon, IconButton, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import labels from '../../Resources/labels';
import { ingSearch } from '../../Redux/Actions';

const styles = {
    page_selection_container: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center'
      },
    page_number_text: {
        fontSize: '14px',
        fontFamily: 'Open Sans',
        fontWeight: 300,
    },
    off:{
        pointerEvents: 'none',
        opacity: 0.5
    },
    showAll: {
        marginLeft: 'auto',
    }
};

class PageSelector extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    decreaseOffset = () => {
        console.log("PAGE SELECTOR")
        console.log(this.props.offset)
        console.log(this.props.limit)
        this.props.search(this.props.offset - this.props.limit)
    }

    increaseOffset = () => {
        console.log("PAGE SELECTOR")
        console.log(this.props.offset)
        console.log(this.props.limit)
        this.props.search(this.props.offset + this.props.limit)
    }

    render() {
        const { classes , offset, limit, items, row_count} = this.props
        let enableDecrease = offset > 0
        let enableIncrease = offset + items.length + 1 < row_count
        return (
            <div className={classes.page_selection_container}>
            { enableDecrease ?
                <IconButton 
                    color={labels.colors.primaryColor}
                    className={classes.button}
                    aria-label="Add an alarm"
                    onClick={this.decreaseOffset}
                >
                    <img src={back}/>
                </IconButton>
                :
                <IconButton 
                    color={labels.colors.primaryColor}
                    className={classes.off}
                    aria-label="Add an alarm"
                    opacity={0.5}
                >
                    <img src={back}/>
                </IconButton>
            }
            <Typography className={classes.page_number_text}>
              Showing items {offset} - {Math.max(offset + items.length - 1, 0)} out of {row_count}
            </Typography>
            { enableIncrease ?
                <IconButton 
                    color={labels.colors.primaryColor}
                    className={classes.button}
                    aria-label="Add an alarm"
                    onClick={this.increaseOffset}
                >
                    <img src={next}/>
                </IconButton>
                :
                <IconButton 
                    color={labels.colors.primaryColor}
                    className={classes.off}
                    aria-label="Add an alarm"
                    opacity={0.5}
                >
                    <img src={next}/>
                </IconButton>
            }
            <Button className={classes.showAll}>
                Show All
            </Button>
          </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        offset: state.ingredients.offset,
        limit: state.ingredients.limit,
        items: state.ingredients.items,
        row_count: state.ingredients.row_count
    };
};

const mapDispatchToProps = dispatch => {
    return {
        search: (offset) => {
            dispatch(ingSearch(offset))
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(PageSelector));
