import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';

/*IMPORT COMPONENT AND CSS*/

import '../static/less/home.less';
import ListShow from "./showList/ListShow";
import IndexShow from "./showList/IndexShow";
import SearchList from "./showList/SearchList";
import Detail from "./Detail";
import BuyNow from "./BuyNow";

export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <section>
            <Switch>
                <Route path='/home' exact component={IndexShow}/>
                <Route path='/home/list' component={ListShow}/>
                <Route path='/home/searchList' component={SearchList}/>
                <Route path='/home/Detail' component={Detail}/>
                <Route path='/home/buynow' component={BuyNow}/>
            </Switch>
        </section>;
    }
}