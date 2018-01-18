import React, {Component} from 'react';
import {Row, Col, Form, Icon, Input} from 'antd';
import MortageForm from './calculator/MortgageForm';
import './App.css';

const FormItem = Form.Item;


class App extends Component {
    render() {
        return (
            <div className="App">
                <Row type="flex" justify="center" align="center">
                    <Col span={12}>
                        {/*<div style={{backgroundColor:"red"}}>Test</div>*/}
                        <MortageForm/>

                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;
