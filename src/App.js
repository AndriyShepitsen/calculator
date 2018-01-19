import React, {Component} from 'react';
import {Row, Col, Form, Icon, Input} from 'antd';
import MortageForm from './calculator/MortgageForm';
import './App.css';

const FormItem = Form.Item;


class App extends Component {
    render() {
        return (
            <div className="App">
                {/*<div style={{backgroundColor:"red"}}>Test</div>*/}
                <MortageForm/>
            </div>
        );
    }
}

export default App;
