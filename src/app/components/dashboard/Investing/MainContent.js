import React, {useState, useEffect, createRef } from 'react';

export const MainContent = (props) => {

  const {symbol} = props;

  const openGoogleFinance = () => {
    const ticker = symbol;
    let url = "https://www.google.com/finance/quote/" + ticker + ":NASDAQ";
    window.open(url, "googleView");
  }

  const openYahooFinance = () => {
    const ticker = symbol;
    let url = "https://finance.yahoo.com/quote/" + ticker ;
    window.open(url, "yahooView");
  }

  const openRobinhoodFinance = () => {
    const ticker = symbol;
    let url = "https://robinhood.com/stocks/" + ticker ;
    window.open(url, "rhView");
  }



  return (

    <div>
    <h1> {symbol} </h1>
    <button onClick={openGoogleFinance} >Google Finance </button>
    <button onClick={openYahooFinance} >Yahoo Finance </button>
    <button onClick={openRobinhoodFinance} >Robinhood Finance </button>
    </div>

  );
}

export default MainContent;
