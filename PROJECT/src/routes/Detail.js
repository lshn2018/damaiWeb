import React from 'react';
import {connect} from 'react-redux';
import action from '../store/action';
import {Link} from 'react-router-dom';
import Qs from 'qs';
import '../static/css/detail.less';
import {Icon, Alert} from 'antd';
import {queryInfo, addCollection, login, checkLogin} from '../api/product';

class Detail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: null,
            cart: {
                collected: [],
                unCollected: []
            },
            isCollected: 0    //是否navBottom收藏，0未收藏，1已收藏
        };
    }

    async componentDidMount() {
        let {location: {search}} = this.props,
            {projectId = 0} = Qs.parse(search.substr(1) || {});
        this.projectId = projectId; //把产品ID挂载到实例上
        //查询商品详情
        let result = await queryInfo(projectId);
        if (parseFloat(result.code) === 0) {
            let {collected, unCollected} = this.props.cart,
                isCollected = 0;
            collected.find(item => parseFloat(item.projectId) === parseFloat(projectId)) ? isCollected = 1 : null;
            unCollected.find(item => parseFloat(item.projectId) === parseFloat(projectId)) ? isCollected = 0 : null;

            this.setState({
                data: result.data,
                isCollected
            })
        }
        //登录操作
        let resultLogin = await login('lmh', '123456789012345678901234');
        if (parseFloat(resultLogin.code) === 0) {
            console.log('您已经登录成功！');
        } else {
            console.log('目前您尚未登录！');
        }

    }

    render() {
        let {data, isCollected} = this.state,
            resD = null, resF = null;
        console.log(data);
        this.data = data;
        if (!data) return '';
        let {name, time, city, address, price, pic, desc, duration, joinTime, limitDesc, explain} = data;

        return <div className='perform'>
            <div className='performPage'>
                <div className='headerBox'>
                    <div className='bg' style={{background: `url(${pic}) no-repeat`, backgroundSize: '300%,300%'}}>
                        <div className='itemBox'>
                            <div className='pic'><img src={pic} alt=""/></div>
                            <p className='title'>{name} </p>
                            <p className='city'>{city}</p>
                            <p className='price'>
                                {price}
                                <span className='priceUnit'> 元</span>
                            </p>
                        </div>
                    </div>

                </div>
                <div className='deHoldTime'>
                    <div className='deLeft'>{time}</div>
                </div>
                <div className='deHoldPlace'>{address}</div>
                <div className='introduce'>
                    <h1 className='desTitle'> 介绍</h1>
                    <div className='desShort'>{desc}</div>
                    {/*<div className='desMore'>*/}
                    {/*<a href=""> 更多图文详情</a>*/}
                    {/*</div>*/}
                </div>
                <div className='noticeOfBuy'>
                    <h1 className='noticeTitle'>购票须知</h1>
                    <div className='infobuy '>
                        <li className='noticeItem'>
                            <span className='noticeInfo'>演出时长</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className='noticeCont'>{duration}</span>
                        </li>
                        <li className='noticeItem'>
                            <span className='noticeInfo'>入场时间</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className='noticeCont'>{joinTime}</span>
                        </li>
                        <li className='noticeItem'>
                            <span className='noticeInfo'>限购说明</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className='noticeCont'>{limitDesc}</span>
                        </li>
                        <li className='noticeItem'>
                            <span className='noticeInfo'>儿童说明</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span className='noticeCont'>{explain}</span>
                        </li>
                    </div>
                    {/*<div className='noticeMore'>*/}
                    {/*<a href=""> 更多购票须知</a>*/}
                    {/*</div>*/}
                </div>
            </div>
            <div className='navBottom'>
                <div className={'col'}></div>
                <div className='wantSee' onClick={this.collection}>
                    <Icon className='heart' type={isCollected === 0 ? 'heart-o' : 'heart'}
                          color={isCollected === 0 ? '' : 'red'}/>
                    <br/>
                    <span>想看</span>
                </div>
                <Link to={{
                    pathname: '/home/buynow',
                    search: `?projectId=${this.projectId}`
                }}>
                    <div className='buyNow' onClick={this.check}>
                        选择购票
                    </div>
                </Link>
            </div>
        </div>;
    }

    collection = async ev => {
        //验证是否登录
        let res = await checkLogin();
        console.log(res);
        if (parseFloat(res.code) === 0) {
            //已经登录成功
            //未想看——>想看状态
            if (this.state.isCollected === 0) {
                console.log(this.projectId);
                let result = await addCollection(this.projectId);
                console.log(result);
                if (parseFloat(result.code) === 0) {
                    //通知redux中更新
                    this.props.queryCollection();
                    this.setState({isCollected: 1});
                    console.log('恭喜您已经收藏成功！');
                } else if (parseFloat(result.code) === 1) {
                    alert('非常遗憾，收藏失败！');
                }
                return;
            }
            //想看状态——>未想看（没有）
            this.setState({isCollected: 0});
            this.props.removeCollection(this.data);

        } else {
            console.log('您当前尚未登录！');
        }

    };
}

export default connect(state => state.detail, action.detail)(Detail);
