import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Icon, IconButton, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import labels from '../../Resources/labels';
import { formulaSearch } from '../../Redux/Actions';

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
        this.props.search(this.props.offset - this.props.limit)
    }

    increaseOffset = () => {
        this.props.search(this.props.offset + this.props.limit)
    }

    showAll = () => {
        this.props.search(-1)
    }

    showSome = () => {
        this.props.search(-2)
    }

    render() {
        const { classes , offset, limit, items, row_count, full,end} = this.props
        let enableDecrease = offset > 0
        let enableIncrease = !end
        return (!full?
            <div className={classes.page_selection_container}>
            { enableDecrease ?
                <IconButton 
                    className={classes.button}
                    aria-label="Add an alarm"
                    onClick={this.decreaseOffset}
                >
                    <img src={back}/>
                </IconButton>
                :
                <IconButton 
                    className={classes.off}
                    aria-label="Add an alarm"
                    opacity={0.5}
                >
                    <img src={back}/>
                </IconButton>
            }
            <Typography className={classes.page_number_text}>
              Showing items {offset} - {Math.max(offset + items.length - 1, 0)}
            </Typography>
            { enableIncrease ?
                <IconButton 
                    className={classes.button}
                    aria-label="Add an alarm"
                    onClick={this.increaseOffset}
                >
                    <img src={next}/>
                </IconButton>
                :
                <IconButton 
                    className={classes.off}
                    aria-label="Add an alarm"
                    opacity={0.5}
                >
                    <img src={next}/>
                </IconButton>
            }
            <Button
                className={classes.showAll}
                onClick = {this.showAll}
            >
                Show All
            </Button>
          </div>
          :
          <div className={classes.page_selection_container}>
          
          <Typography className={classes.page_number_text}>
            Showing items All {items.length} items
          </Typography>
          
          <Button
              className={classes.showAll}
              onClick = {this.showSome}
          >
              Show Some
          </Button>
        </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        offset: state.formulas.offset,
        limit: state.formulas.limit,
        items: state.formulas.items,
        row_count: state.formulas.row_count,
        full: state.formulas.full,
        end: state.formulas.end
    };
};

const mapDispatchToProps = dispatch => {
    return {
        search: (offset) => {
            dispatch(formulaSearch(offset))
        },
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(PageSelector));
