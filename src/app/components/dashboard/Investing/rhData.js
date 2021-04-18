import React from 'react';
const { exec } = require('child_process');

export const DATA_RH_MOVERS = 'rh_movers_list';
export const DATA_RH_OPEN_POSITIONS = 'rh_account_positions';
export const DATA_RH_LIST_A_LIST = 'rh_account_watchlist_a_list';
export const DATA_RH_LIST_DEFAULT = 'rh_account_watchlist';


export const loadGridData = (gridName, args, recvfn) => {

  let urlPrefix = "https://localhost:8000/api/";
  let dataURL = '';

  switch (gridName) {
    case DATA_RH_MOVERS:
      dataURL = "rh/marketdata";
      break;
    case DATA_RH_OPEN_POSITIONS:
        dataURL = "rh/accdata?op=pos";
        break;
    case DATA_RH_LIST_DEFAULT:
          dataURL = "rh/accdata?op=wl";
          break;
    case DATA_RH_LIST_A_LIST:
          dataURL = "rh/accdata?op=wl&wl=A-List";
          break;
    default:
  }

  console.log('Getting data  (Calling) from URL:', urlPrefix + dataURL);

  fetch(urlPrefix + dataURL, {})
    .then((response) => {
      if (response.status !== 200) {
        recvfn(gridName, args, {
          placeholder: 'Something went wrong in getting data',
        });
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      let gridData = data.result;
      console.log(
        'Sending data to receving fn from URL:',
        urlPrefix + dataURL,
        gridName,
        args
      );
      recvfn(gridName, args, gridData);
    });

}
