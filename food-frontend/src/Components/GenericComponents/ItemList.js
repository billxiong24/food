import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SimpleList from './ItemList';
import SimpleCard from './SimpleCard';

class ItemList extends Component {
  render() {
    return (
      <div>
        {
        this.props.items.map((item, index) => (
          <SimpleCard item={item}></SimpleCard>
        ))}
      </div>
    );
  }
}

export default ItemList;