import React from 'react'
import { connect } from 'react-redux'
import { Input, Spin, Alert } from 'antd'
import * as actions from '../actions/actions'
import { withRouter } from 'react-router-dom'
import * as Utils from '../utils/utils'

const Search = Input.Search;

class SearchComponent extends React.Component {
  constructor(args) {
    super(args);
    this.add = this.add.bind(this);
    this.search = this.search.bind(this);
    this.state = {
      searchArr: [],
      searching: false,
      searched: false,
      error: false,
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  add(id) {
    const { user } = this.props;
    this.props.add(id, user);
  }
  search(keyword) {
    this.setState({
      searching: true,
      searched: false,
      error: false,
    })
    this.props.search(keyword).then(res => {
      if (res === false) {
        this.setState({
          searching: false,
          searched: true,
          error: true,
        })
      } else {
        this.setState({
          searching: false,
          searched: true,
          error: false,
          searchArr: Array.from(res),
        })
      }
    })
  }
  render() {
    const { user } = this.props
    const sarr = Utils.renderSearchRes(this.state.searchArr, this.add);
    return (
      <div className="" style={{ minHeight: 800, overflow: 'hidden', padding: '0 20px' }} >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }} >
          <Search
            placeholder="input search text"
            style={{ width: '60%' }}
            onSearch={value => this.search(value)}
          />
        </div>
        {
          (this.state.searching) ? (
            <Spin tip="Loading...">
              <Alert
                message="Alert message title"
                description="Further details about the context of this alert."
                type="info"
              />
            </Spin>
          ) : (
              (this.state.searched) ?
                (<div className="search-wrap" >
                  {sarr}
                </div>) : (
                  <div className="wrap" >
                    请输入搜索内容
                  </div>
                )
            )
        }

      </div>
    )
  }
}
const mapStateToProp = (state) => {
  const { chatReducer: { user, socket } } = state;
  return {
    user, socket
  }
}
const mapDispatchToProp = (dispatch) => {
  return {
    search: (keyword) => dispatch(actions.search(keyword)),
    add: (id, user) => dispatch(actions.addApply(id, user)),
  }
}
export default withRouter(connect(mapStateToProp, mapDispatchToProp)(SearchComponent));