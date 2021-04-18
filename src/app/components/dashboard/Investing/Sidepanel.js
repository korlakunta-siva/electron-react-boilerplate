import React, {useState, useEffect, createRef } from 'react';

import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ApexDataGrid from '../../../../components/datagrid/ApexDataGrid'

export const Sidepanel = (props) => {

  const { stocklist } = props;


  let stockItems = (
    <SingleLineGridList>
      {stocklist.map(stock => (
        <GridListTile
          key={stock.symbol}
          style={{ width: 'auto', height: 'auto' }}
        >
         <span onClick={()=>{props.tickerClick(stock.symbol)}}>{stock.symbol}  {stock.ask_price}</span>
        </GridListTile>
      ))}
    </SingleLineGridList>
  )

  console.log("Received in Sidepanel", stocklist, stockItems);

  return (
    <div>
      { stockItems  }
    </div>

  );
}

const useSingleLineGridListStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  }
}))

const SingleLineGridList = props => {
  const classes = useSingleLineGridListStyles()

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2}>
        {props.children}
      </GridList>
    </div>
  )
}

export default Sidepanel;
