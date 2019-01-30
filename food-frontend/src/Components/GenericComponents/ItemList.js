import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SimpleList from './ItemList';
import SimpleCard from './SimpleCard';

class ItemList extends Component {
  render() {
    console.log(this.props.items)
    return (
      <div>
        {
        this.props.items.map((item, index) => (
          React.cloneElement(this.props.children, { key: index, item: item })
        ))
        }
      </div>
    );
  }
}

export default ItemList;