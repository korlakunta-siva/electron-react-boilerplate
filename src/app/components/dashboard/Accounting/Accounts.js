import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { PlaidLink } from 'react-plaid-link'
import { connect } from 'react-redux'
import AccountCard from './AccountCard'
import RGL, { WidthProvider } from 'react-grid-layout'

import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { cli_showfile } from '../../../../utils/cli'
import ApexDataGrid from '../../../../components/datagrid/ApexDataGrid'
import { apiURL } from '../../../../api/apiConfig'
import { DATA_CURRENT_STATUS, loadGridData } from './accountsData'

import axios from 'axios'
import {
  getTransactions,
  addAccount,
  refreshAccount,
  deleteAccount
} from '../../../redux/actions/accountActions'

//import MaterialTable from "material-table"; // https://mbrn.github.io/material-table/#/
//import { DataGrid } from '@material-ui/data-grid';

//import MUIDataTable from "mui-datatables";
import ReactDataGrid from 'react-data-grid'
import { Toolbar, Data, Filters } from 'react-data-grid-addons'
import DataGrid from '../DataGridNew'

const ReactGridLayout = WidthProvider(RGL)

class Accounts extends Component {
  constructor (props) {
    super(props)
    this.tranGridElement = React.createRef()

    this.onLayoutChange = this.onLayoutChange.bind(this)
  }

  onLayoutChange (layout) {
    //this.props.onLayoutChange(layout);
  }

  state = {
    dataCurrentStatus: {},
    updateAccessToken: null,
    transactionsData: [],
    filepath: '',
    iframeRef: createRef()
    //   filters : {},
    //   transactionsData : []
  }

  componentDidMount () {
    //const { accounts } = this.props;
    //this.props.getTransactions(accounts);

    const path = 'file.pdf'
    const frame_element = `/pdfjs/web/viewer.html?file=${path}`
    loadGridData(DATA_CURRENT_STATUS, {}, this.recvGridData);

    this.setState({ filepath: frame_element })
  }


  recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData);

    switch (gridName) {
      case DATA_CURRENT_STATUS:
        this.setState(
          {
            dataCurrentStatus: gridData,
            loaded: true,
          },
          () => {
            console.log(
              'Changed state Current Status',
              this.state.dataCurrentStatus.length
            );
          }
        );
        break;


      default:
    }
  };

  // Add account
  onGetTransactionsClick = () => {
    const { accounts } = this.props
    this.props.getTransactions(accounts)
  }

  // Add account
  handleOnSuccess = (token, metadata) => {
    const { accounts } = this.props
    const plaidData = {
      public_token: token,
      metadata: metadata,
      accounts: accounts
    }
    console.log('Received Public Token: ' + token, metadata)

    this.props.addAccount(plaidData)
  }

  handleOnUpdateTokenSuccess = (token, metadata) => {
    const { accounts } = this.props
    const plaidData = {
      public_token: token,
      updateAccessToken: this.state.updateAccessToken,
      metadata: metadata,
      accounts: accounts
    }
    console.log('Received Public Token: ' + token, metadata)
    this.props.refreshAccount(plaidData)
  }

  onShowTransactionsClick = id => {
    this.setState({ transactionsData: [] })
    this.props.getTransactions(id, 'view')
  }

  onGetPlaidTransactionsClick = id => {
    console.log('Called Retrieve-100: ' + id)
    this.props.getTransactions(id, 'refresh')
  }

  onGetAllPlaidTransactionsClick = id => {
    this.props.getTransactions(id, 'gethx')
  }

  onUpdateAccountsClick = id => {
    this.props.getTransactions(id, 'ua')
  }

  onUpdateTokenClick = id => {
    axios
      .post(apiURL + '/get_update_link_token', { id: id })
      .then(res => {
        let linkToken_forupdate = res.data.link_token
        this.setState({ updateAccessToken: linkToken_forupdate })
      })
      .catch(err => console.log(err))
  }

  // Delete account
  onDeleteClick = id => {
    const { accounts } = this.props
    const accountData = {
      id: id,
      accounts: accounts
    }
    this.props.deleteAccount(accountData)
  }

  //    handleFilterChange = filter => filters => {
  //     const newFilters = { ...filters };
  //     if (filter.filterTerm) {
  //       newFilters[filter.column.key] = filter;
  //     } else {
  //       delete newFilters[filter.column.key];
  //     }
  //     this.setState({filters: newFilters})
  //     return newFilters;
  //   };

  //    getValidFilterValues = (rows, columnId)  => {
  //     return rows
  //       .map(r => r[columnId])
  //       .filter((item, i, a) => {
  //         return i === a.indexOf(item);
  //       });
  //   }

  //    getRows = (rows, filters) => {
  //     //console.log(filters);
  //     return Data.Selectors.getRows({ rows, filters });
  //   }

  //  // const filteredRows = getRows(this.state.transactionsData, this.state.filters);

  //  sortRows = (initialRows, sortColumn, sortDirection) => rows => {
  // const comparer = (a, b) => {
  //   if (sortDirection === "ASC") {
  //     return a[sortColumn] > b[sortColumn] ? 1 : -1;
  //   } else if (sortDirection === "DESC") {
  //     return a[sortColumn] < b[sortColumn] ? 1 : -1;
  //   }
  // };
  // this.setState ({ transactionsData : sortDirection === "NONE" ? initialRows : [...rows].sort(comparer) });
  // };

  // onRowSelectExam = data => {

  //   let check_num = data[0].row.name.replace("CHECK CLEARED #","");
  //   let check_path = `\\\\pcode-nas1\\skshare\\AcctDocs\\Banks\\Apex\\BBVA\\Checking5555\\CheckImages\\${check_num}check`;
  //   cli_showfile(check_path);

  //   // window.open(check_path)
  //   // console.log(check_path);
  //   // console.log(data);
  // };

  onRowSelectExam = event => {
    console.log('AG Row selected', event)

    let selectedNodes = event.api
      .getSelectedNodes()
      .filter(node => node.selected)
    console.log(selectedNodes)
  }

  onRowSelectView = data => {
    console.log('Transaction View:', data)
    console.log('TO DIsplay' + data.dirpath + '/' + data.fileName)

    let check_num = data.name.replace('CHECK CLEARED #', '')
    let check_path = `\\\\pcode-nas1\\skshare\\AcctDocs\\Banks\\Apex\\BBVA\\Checking5555\\CheckImages\\${check_num}check.pdf`

    console.log('Starting to get Check File', check_path)

    const frame_element = `../public/pdfjs/web/viewer.html?file=${check_path} `

    this.setState({ filepath: frame_element })

    //this.handleLinqReportPdf(check_path);
  }

  handleLinqReportPdf = filename => {
    console.log('Starting to get Check File', filename)
    fetch(encodeURI(apiURL + '/getecwfile?filename=' + filename))
      .then(this.handleErrors)
      .then(r => r.blob())
      .then(blob => {
        let url = URL.createObjectURL(blob)
        let viewerUrl = encodeURIComponent(url)

        const frame_element = `../public/pdfjs/web/viewer.html?file=${viewerUrl} `

        this.setState({ filepath: frame_element })
      })
  }

   loadblobPDF = blob => {
    console.log('Ready to Loadin PDF from base64')

    try {
      let iframePdf = pdfControl.iframeRef.current.contentWindow
      //console.log(iframePdf);
      //console.log(iframePdf.PDFViewerApplication);
      if (iframePdf !== undefined) {
        let iframePdf2 = iframePdf.contentWindow
        //iframePdf.PDFViewerApplication.open();

        iframePdf.PDFViewerApplication.open(blob)
        //iframePdf.PDFViewerApplication.toolbar.openFile.click(); // iframePdf.PDFViewerApplication
        //iframePdf.print();
      }
    } catch (error) {}

    // ipcRenderer.send('show-file', 'ping')
  }


  loadblobPDFURL = pdfURL => {
    console.log('Ready to Loadin PDF from base64', pdfURL)

    const frame_element = `../public/pdfjs/web/viewer.html?file=${pdfURL} `

    this.setState({ filepath: frame_element })


    try {
      // let iframePdf = pdfControl.iframeRef.current.contentWindow
      // //console.log(iframePdf);
      // //console.log(iframePdf.PDFViewerApplication);
      // if (iframePdf !== undefined) {
      //   let iframePdf2 = iframePdf.contentWindow
      //   //iframePdf.PDFViewerApplication.open();
      //   iframePdf.PDFViewerApplication.open(pdfURL)
      //   //iframePdf.PDFViewerApplication.toolbar.openFile.click(); // iframePdf.PDFViewerApplication
      //   //iframePdf.print();


      url = {
        url : pdfURL,
        originalUrl: "Temp File Name"
      };


      let iframePdf = pdfControl.iframeRef.current.contentWindow
      // //console.log(iframePdf);
      // //console.log(iframePdf.PDFViewerApplication);
      if (iframePdf !== undefined) {
        let iframePdf2 = iframePdf.contentWindow
      //   //iframePdf.PDFViewerApplication.open();


      //iframePdf2.PDFViewerApplication.open(pdfURL)



      //   //iframePdf.PDFViewerApplication.toolbar.openFile.click(); // iframePdf.PDFViewerApplication
      //   //iframePdf.print();


      //PDFViewerApplication.open(url);

      }

    } catch (error) {}

    // ipcRenderer.send('show-file', 'ping')
  }



  render () {
    const { user, accounts, linkToken } = this.props
    const { transactions, transactionsLoading } = this.props.plaid

    // {accountItems.map((tile) => (
    //           <GridListTile key={tile.account_id}>
    //             <img src={tile.img} alt={tile.institutionName} />
    // {tile}
    //           </GridListTile>
    //         ))
    // }

    // Setting up data table
    const transactionsColumns = [
      { headerName: 'Account', field: 'account', width: 200, type: 'string' },
      { headerName: 'Date', field: 'date', width: 110, type: 'date' },
      { headerName: 'Amount', field: 'amount', type: 'number', width: 120 },
      { headerName: 'Name', field: 'name', width: 250 },
      { headerName: 'Category', field: 'category', width: 150 }
    ]

    //const filteredRows = this.getRows(this.state.transactionsData, this.state.filters);

    // { field: 'firstName', headerName: 'First name', width: 130 },

    // let transactionsData = [];
    // transactions.forEach(function(account) {
    //   account.transactions.forEach(function(transaction) {
    //     transactionsData.push({
    //       account: account.accountName,
    //       date: transaction.date,
    //       category: transaction.category[0],
    //       name: transaction.name,
    //       amount: transaction.amount
    //     });
    //   });
    // });

    //   let rowdata = {
    //     account: row.account.accountName,
    //     date: row.transaction.date,
    //     category: row.transaction.category[0],
    //     'name': row.transaction.name,
    //     'amount': row.transaction.amount
    //   }
    //   return rowdata;
    // });

    // transactions.map( row => {
    //   let rowdata = {
    //     account: row.account.accountName,
    //     date: row.transaction.date,
    //     category: row.transaction.category[0],
    //     'name': row.transaction.name,
    //     'amount': row.transaction.amount
    //   }
    //   return rowdata;
    // });

    // transactions.forEach(function(account) {
    //   account.transactions.forEach(function(transaction) {
    //     transactionsData.push({
    //       account: account.accountName,
    //       date: transaction.date,
    //       category: transaction.category[0],
    //       name: transaction.name,
    //       amount: transaction.amount
    //     });
    //   });
    // });

    let transactionsData = []
    if (transactions) {
      let trans = transactions.transactions

      if (trans && trans.length > 0) {
        transactionsData = trans.map(tran => {
          return {
            id: tran.id,
            account: tran.account,
            date: tran.date,
            category: tran.category,
            name: tran.transaction_name,
            amount: tran.amount
          }
        })

        //this.setState({ transactionsData : transactionsData})
        console.log('Ready to display transactions:', transactionsData)
        //this.tranGridElement.current.changeGridData(transactionsData,rdg_columns );
        if (this.state.transactionsData.length == 0) {
          this.setState({ transactionsData: transactionsData })
        }
      }
    }

    let accountItems = (
      <SingleLineGridList>
        {accounts.map(account => (
          <GridListTile
            key={account.itemId}
            style={{ width: 'auto', height: 'auto' }}
          >
            <AccountCard
              key={account.itemId}
              account={account}
              onView={this.onShowTransactionsClick}
              onUpdateAccounts={this.onUpdateAccountsClick}
              onRetrieve100={this.onGetPlaidTransactionsClick}
              onRetrieveAll={this.onGetAllPlaidTransactionsClick}
              onUpdateToken={this.onUpdateTokenClick}
            />
          </GridListTile>
        ))}
      </SingleLineGridList>
    )



    return (
      <div>
        {this.state.dataCurrentStatus.environment}
        {linkToken ? (
          <PlaidLink
            token={linkToken}
            onLoad={this.handleOnLoad}
            onSuccess={this.handleOnSuccess}
            onExit={function (err, metadata) {
              // The user exited the Link flow.
              if (err != null) {
                // The user encountered a Plaid API error prior to exiting.
                console.log(err)
                console.log('plaid link error')
              }

              console.log('plaid link exited')
              // metadata contains information about the institution
              // that the user selected and the most recent API request IDs.
              // Storing this information can be helpful for support.
            }}
            onEvent={function (eventName, metadata) {
              // Optionally capture Link flow events, streamed through
              // this callback as your users connect an Item to Plaid.
              // For example:
              // eventName = "TRANSITION_VIEW"
              // metadata  = {
              //   link_session_id: "123-abc",
              //   mfa_type:        "questions",
              //   timestamp:       "2017-09-14T14:42:19.350Z",
              //   view_name:       "MFA",
              // }
              console.log('plaid link event: ' + eventName)
            }}
          >
            Link Account
          </PlaidLink>
        ) : (
          ''
        )}

        {this.state.updateAccessToken ? (
          <PlaidLink
            token={this.state.updateAccessToken}
            onLoad={this.handleOnLoad}
            onSuccess={this.handleOnUpdateTokenSuccess}
            onExit={function (err, metadata) {
              // The user exited the Link flow.
              if (err != null) {
                // The user encountered a Plaid API error prior to exiting.
                console.log(err)
                console.log('plaid link error')
              }

              console.log('plaid link exited')
              // metadata contains information about the institution
              // that the user selected and the most recent API request IDs.
              // Storing this information can be helpful for support.
            }}
            onEvent={function (eventName, metadata) {
              // Optionally capture Link flow events, streamed through
              // this callback as your users connect an Item to Plaid.
              // For example:
              // eventName = "TRANSITION_VIEW"
              // metadata  = {
              //   link_session_id: "123-abc",
              //   mfa_type:        "questions",
              //   timestamp:       "2017-09-14T14:42:19.350Z",
              //   view_name:       "MFA",
              // }
              console.log('plaid link event: ' + eventName)
            }}
          >
            Update Account Token
          </PlaidLink>
        ) : (
          ''
        )}

        {accountItems}

        {/* <DataGrid
                    ref={this.tranGridElement}
                    initialRows={transactionsData}
                    enableFilter
                    columns={rdg_columns}
                    gridheight={600}
                    gridname={"transactions"}
                    onRowSelect={this.onRowSelectExam}
                  />{" "} */}

        <ReactGridLayout
          className='layout'
          onLayoutChange={this.onLayoutChange}
          rowHeight={30}
        >
          <div
            key='1'
            data-grid={{
              x: 0,
              y: 0,
              w: 7,
              h: 5,
              minH: 3,
              maxH: 12,
              static: true,
              isResizable: true
            }}
          >
            <ApexDataGrid
              key='linq'
              gridname={'transactions'}
              ref={this.tranGridElement}
              gridData={this.state.transactionsData}
              onRowSelected={this.onRowSelectExam}
              button2Label='View'
              onButton2Callback={this.onRowSelectView}
              onPrintPDF={this.loadblobPDFURL}
            />
          </div>

          <div
            key='2'
            data-grid={{ x: 9, y: 0, w: 5, h: 2, isResizable: true }}
            style={{ height: '90%', width: '100%', margin: 0 }}
          >
            <button id='myButton3' onClick={this.nextPDFPage}>
              Previous Page{' '}
            </button>
            <button id='myButton4' onClick={this.nextPDFPage}>
              Next Page{' '}
            </button>
            <iframe
              width='100%'
              height='600px'
              backgroundcolor='lightgrey'
              ref={this.state.iframeRef}
              src={this.state.filepath}
            />
          </div>
        </ReactGridLayout>
      </div>
    )
  }
}

Accounts.propTypes = {
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  refreshAccount: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  plaid: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  plaid: state.plaid
})

export default connect(mapStateToProps, {
  getTransactions,
  addAccount,
  refreshAccount,
  deleteAccount
})(Accounts)

const tileData = [
  {
    img: 'images/image1.jpg',
    title: 'title'
  },
  {
    img: 'images/image2.jpg',
    title: 'title'
  },
  {
    img: 'images/image3.jpg',
    title: 'title'
  },
  {
    img: 'images/image1.jpg',
    title: 'title'
  },
  {
    img: 'images/image2.jpg',
    title: 'title'
  },
  {
    img: 'images/image3.jpg',
    title: 'title'
  }
]

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
