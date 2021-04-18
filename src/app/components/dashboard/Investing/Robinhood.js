import React, {useState, useEffect, createRef } from 'react';
import ApexDataGrid from '../../../../components/datagrid/ApexDataGrid'
import Sidepanel from './Sidepanel';
import MainContent from './MainContent';

import {
  DATA_RH_MOVERS,
  DATA_RH_OPEN_POSITIONS,
  DATA_RH_LIST_A_LIST,
  DATA_RH_LIST_DEFAULT,
  loadGridData } from './rhData';


export const InvestApp = () => {

  const [stateData, setstateData] = useState({
    dataMovers: [],
    dataPositions: [],
    dataListDefault: [],
    dataListAList : [],
    currentSymbol : null,
    filepath: '',
    iframeRef: createRef()
  })

  const [tablValue, settablValue] = useState(0);

  useEffect(() => {
    loadGridData(DATA_RH_MOVERS, {}, recvGridData);
    loadGridData(DATA_RH_OPEN_POSITIONS, {}, recvGridData);
    loadGridData(DATA_RH_LIST_A_LIST, {}, recvGridData);
    loadGridData(DATA_RH_LIST_DEFAULT, {}, recvGridData);
    // loadGridData(DATA_APEX_EOB_DOCS, {}, recvGridData);
    // loadGridData(DATA_APEX_BL_DOCS, {}, recvGridData);
  }, [])

  const handleGridRefresh = gridName => {
    switch (gridName) {
      case DATA_RH_MOVERS:
        console.log('Refresh called on: ', gridName);
        //setstateData({ ...stateData, dataPatientList: [] })
        loadGridData(gridName, {}, recvGridData);
        break;
      case DATA_RH_OPEN_POSITIONS:
          console.log('Refresh called on: ', gridName);
          //setstateData({ ...stateData, dataPatientList: [] })
          loadGridData(gridName, {}, recvGridData);
          break;
      case DATA_RH_LIST_A_LIST:
            console.log('Refresh called on: ', gridName);
            //setstateData({ ...stateData, dataPatientList: [] })
            loadGridData(gridName, {}, recvGridData);
            break;
      case DATA_RH_LIST_DEFAULT:
              console.log('Refresh called on: ', gridName);
              //setstateData({ ...stateData, dataPatientList: [] })
              loadGridData(gridName, {}, recvGridData);
              break;
      default:
    }
  }

  const recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData)

    switch (gridName) {
      case DATA_RH_MOVERS:
        setstateData({ ...stateData, dataMovers: gridData });
        break;
      case DATA_RH_OPEN_POSITIONS:
          setstateData({ ...stateData, dataPositions: gridData.results });
          break;
      case DATA_RH_LIST_A_LIST:
            setstateData({ ...stateData, dataListAList: gridData.results });
            break;
      case DATA_RH_LIST_DEFAULT:
              setstateData({ ...stateData, dataListDefault: gridData.results });
              break;
      default:
    }
  }

  const handleTickerClick = (ticker) => {
    console.log("Clocked: " + ticker);
    setstateData({ ...stateData, currentSymbol: ticker });
  }


  return (
    <div>
      <h1>Investment App</h1>
      { stateData.dataMovers.length > 0 ?
      <Sidepanel stocklist = {stateData.dataMovers} tickerClick = {handleTickerClick} /> : "" }
      <MainContent symbol = {stateData.currentSymbol} />
    </div>
  )
}

export default InvestApp;
