import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import store from '../../store/index'
import action from '../../store/action/index'
import '../../static/css/Cart.less'
import {queryCartList, queryList} from '../../api/register'
import CellList from '../../component/CellList'
import {Link} from 'react-router-dom'

class Cart extends React.Component {
    constructor(props,context) {
        super(props, context);
        this.state={
            listData:[]
        }

    }
    async componentDidMount(){
        let {cart:{isCollected},isSelected}=this.props;

        let result=await queryCartList();
        if(parseFloat(result.code)===0){
            let {data}=result;
            this.setState({
                listData:data
            })
        }
    }
    render() {
        let listData=this.state.listData;
        return <div>
            {/*  <SearchBar/>*/}
            <div className={'con-axis fixTop'}>
                {
                    this.state.listData.length === 0 ? (<div style={{
                        textAlign: 'center',
                        paddingTop: '.4rem'
                    }}><p>暂时没有记录</p></div>) : listData.map((item, index) => {
                        let {projectId
                        } = item;
                        return <Link to={{
                            pathname: '/home/list/info',
                            search: `?projectId=${projectId}`
                        }}><CellList key={index} showData={item}/></Link>
                    })
                }
            </div>
        </div>
    }
}

export default withRouter(connect(state=>({...state.buyNow}),action.buyNow)(Cart));