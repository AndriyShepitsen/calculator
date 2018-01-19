import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import formula from "./formula"
import AmortizationChart from "./AmortizationChart";

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {

    state = {
        amortization: [],
        homeValue: 100000,
        loanAmount: 80000,
        interestRate: 3,
        loanTerm: 30,
        taxes: 5000,
        pmi: 1.5,
        insurance: 1000,
        monthlyPayment: 0
    }

    componentDidMount() {
        let payment = formula(this.state)

        this.setState({
            monthlyPayment: payment.monthlyPayment,
            amortization: payment.amortization
        });
    }


    handleFormChange = (e, name) => {
        let value = parseFloat(e.target.value);
        this.setState({
            [name]: value
        }, () => {
            let payment = formula(this.state)

            this.setState({
                monthlyPayment: payment.monthlyPayment,
                amortization: payment.amortization
            });

        });

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if ( !err ) {

                let payment = formula(this.state)
                this.setState({
                    monthlyPayment: payment.monthlyPayment,
                    amortization: payment.amortization
                });
            }
        });


    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={{padding: '0px 5px'}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Row gutter={8}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <FormItem label="Home Value">
                                {getFieldDecorator('homeValue', {
                                    initialValue: this.state.homeValue,
                                    rules: [ {
                                        required: false
                                    } ],
                                    onChange: (e) => this.handleFormChange(e, 'homeValue'),
                                })(
                                    <Input placeholder="Home Value"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <FormItem label="Loan Amount">
                                {getFieldDecorator('loanAmount', {
                                    initialValue: this.state.loanAmount,
                                    rules: [ {required: true, message: 'Please input your a loan amount'} ],
                                    onChange: (e) => this.handleFormChange(e, 'loanAmount'),
                                })(
                                    <Input type="text" placeholder="Loan amount"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <FormItem label="Interest Rate">
                                {getFieldDecorator('interestRate', {
                                    initialValue: this.state.interestRate,
                                    rules: [ {required: true, message: 'Please input your an interest rate'} ],
                                })

                                (
                                    <Input type="text" placeholder="Interest rate"
                                           onChange={(e) => this.handleFormChange(e, 'interestRate')}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={6}>
                            <FormItem label="Loan Term">
                                {getFieldDecorator('loanTerm', {
                                    initialValue: this.state.loanTerm,
                                    rules: [ {required: true, message: 'Please input your loan term'} ],
                                })

                                (
                                    <Input type="text" placeholder="Loan Term"
                                           onChange={(e) => this.handleFormChange(e, 'loanTerm')}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <FormItem label="Taxes">
                                {getFieldDecorator('taxes', {
                                    initialValue: this.state.taxes,
                                    rules: [ {required: false} ],
                                })

                                (
                                    <Input type="text" placeholder="Taxes"
                                           onChange={(e) => this.handleFormChange(e, 'taxes')}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <FormItem label="Private Mortgage Insurance">
                                {getFieldDecorator('pmi', {

                                    initialValue: this.state.pmi,
                                    rules: [ {required: false} ],
                                })

                                (
                                    <Input type="text" placeholder="Private Mortgage Insurance"
                                           onChange={(e) => this.handleFormChange(e, 'pmi')}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <FormItem label="Home Insurance">
                                {getFieldDecorator('insurance', {
                                    initialValue: this.state.insurance,
                                    rules: [ {required: false} ],
                                })

                                (
                                    <Input type="text" placeholder="Insurance"
                                           onChange={(e) => this.handleFormChange(e, 'insurance')}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem style={{textAlign: "left"}}>
                        <Button htmlType="submit"
                                className="login-form-button">Calculate</Button>
                    </FormItem>
                </Form>
                {
                    this.state.monthlyPayment > 0 &&
                    <div>
                        <div className={"monthlyPayment"}>
                            <strong>Monthly payment: </strong>
                            {this.state.monthlyPayment} $/Month
                        </div>
                        <AmortizationChart data={this.state.amortization}/>
                    </div>
                }
            </div>

        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
