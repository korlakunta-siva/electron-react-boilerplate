import React, { useEffect } from 'react'
import RGL, { WidthProvider } from 'react-grid-layout'
import ApexDataGrid from '../../../components/datagrid/ApexDataGrid'

const { ipcRenderer } = window.require('electron')
const { exec } = require('child_process')

const ReactGridLayout = WidthProvider(RGL)

export const TaigaApp = props => {
  const onLayoutChange = layout => {
    //this.props.onLayoutChange(layout);
  }

  useEffect(() => {
    this.onLayoutChange = this.onLayoutChange.bind(this)
  }, [])

  const [stateData, setStateData] = useState({
    searchData: [],
    iframeRef: '',
    filepath: createRef()
  })

  const [searchText, setSearchText] = useState('')

  recvGridData = (gridName, args, gridData) => {
    console.log('ReceivedData for :', gridName, args, gridData)

    switch (gridName) {
      case DATA_CURRENT_STATUS:
          setStateData({...stateData, searchData: gridData});
               break

      default:
    }
  }

  const handleSearchTextChange = e => {
    console.log(e.target.value) // your search bar text
    setSearchText = e.target.value
  }

  const handleSearch = () => {
      console.log("Read tp search with: " + searchText)
  }

  return (
    <div>
      <ReactGridLayout
        className='layout'
        onLayoutChange={this.onLayoutChange}
        rowHeight={30}
      >
        <div>
          <input
            type='text'
            className='input'
            onChange={handleSearchTextChange}
            value={searchText}
            placeholder='Search...'
          />
        </div>
        <div>
          <input
            type='button'
            className='input'
            onChange={handleSearch}
            value="Search"          />
        </div>
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
            gridData={stateData.searchData}
            onRowSelected={this.onRowSelectExam}
            button2Label='Open'
            onButton2Callback={this.onRowSelectView}
          />
        </div>

        {/* <div
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
            ref={stateData.iframeRef}
            src={stateData.filepath}
          />
        </div> */}
      </ReactGridLayout>
    </div>
  )
}
