import React from 'react';
import {Row, Col, Form, Input, Button, Tooltip, Card} from 'antd';
import formula from "./formula"
import AmortizationChart from "./AmortizationChart";
import processInput from "./util/processInput";
import parseInput from "./util/parseInput";
import computeLoan from "./util/computeLoan";
import computePropTaxes from "./util/computePropTaxes";


const FormItem = Form.Item;

class MortgageForm extends React.Component {

    state = {
        validateHomePrice: {
            validateStatus: 'success',
            errorMsg: null,
        },
        paymentSplit:null,
        amortization: [],
        homePrice: "100,000",
        downPayment: "20,000",
        downPaymentPercent: 20,
        loan: "80,000",
        interestRate: 3,
        loanTerm: 30,
        taxes: "1,270",
        taxesPercent: 1.27,
        pmi: .65,
        insurance: 800,
        monthlyPayment: 0
    }

    componentDidMount() {
        let fields = this.getAllFields();
        let payment = formula(fields)

        this.setState({
            paymentSplit:payment.paymentSplit,
            monthlyPayment: payment.monthlyPayment,
            amortization: payment.amortization
        });
    }


    handleFormChange = (e, name) => {
        let value = parseFloat(e.target.value);

        switch ( name ) {
            case "taxesPercent":
                let taxes = computePropTaxes({...this.getAllFields(), taxesPercent: value});
                this.props.form.setFieldsValue({taxes})
                break;

            default:
        }


        this.setState({
            [name]: value
        }, () => {
            let fields = this.getAllFields();


            let payment = formula(fields);
            this.setState({
                paymentSplit:payment.paymentSplit,
                loan: computeLoan(fields),
                monthlyPayment: payment.monthlyPayment,
                amortization: payment.amortization
            });
        });
    };

    handleDownPaymentChange = (e, name) => {

        let value = parseInput(( e.target.value ));
        var downPayment, downPaymentPercent, homePrice;

        switch ( name ) {
            case "homePrice":
                let isPriceValid = this.validateStatus(value)
                if ( !isPriceValid ) {
                    return;
                }
                homePrice = value;
                let homePriceparsed = parseInt(homePrice, 10);
                if ( homePriceparsed > 0 ) {
                    downPayment = parseInput(this.props.form.getFieldValue("downPayment"));
                    downPaymentPercent = ( (downPayment / homePrice * 100) ).toFixed(2).replace(".00", "");
                    let downPaymentPercentParsed = parseFloat(downPaymentPercent);

                    if ( downPaymentPercentParsed > 100 ) {
                        downPaymentPercentParsed = parseFloat(this.props.form.getFieldValue("downPaymentPercent"));
                        downPayment = processInput(homePriceparsed * (downPaymentPercentParsed / 100));
                        this.props.form.setFieldsValue({downPayment})
                    } else {
                        this.props.form.setFieldsValue({downPaymentPercent})
                    }
                    let taxes = computePropTaxes({...this.getAllFields(), homePrice});
                    this.props.form.setFieldsValue({taxes: taxes})
                }

                break;
            case "downPayment":
                downPayment = value;
                if ( isNaN(downPayment) ) {

                    // this.props.form.setFieldsValue( {downPaymentPercent: "0"} )

                } else {

                    homePrice = parseInput(this.props.form.getFieldValue("homePrice"));
                    if ( homePrice > 0 ) {
                        downPaymentPercent = ( (downPayment / homePrice * 100) ).toFixed(2).replace(".00", "");
                        this.props.form.setFieldsValue({downPaymentPercent})
                    }
                }

                break;
            case "downPaymentPercent":
                downPaymentPercent = value;
                let number = parseInt(downPaymentPercent, 10);
                if ( number > 20 ) {
                    this.props.form.setFieldsValue({pmi: 0})
                } else {
                    this.props.form.setFieldsValue({pmi: 0.65})
                }
                homePrice = parseInput(this.props.form.getFieldValue("homePrice"));
                downPayment = (( downPaymentPercent * homePrice ) / 100);
                this.props.form.setFieldsValue({downPayment: processInput(downPayment)});

                break;
            default:
                console.log("Unrecognized change for a down payment computations")
        }

        setTimeout(() => {
            let fields = this.getAllFields();
            let payment = formula(fields)
            this.setState({
                paymentSplit:payment.paymentSplit,
                loan: computeLoan(fields),
                monthlyPayment: payment.monthlyPayment,
                amortization: payment.amortization
            });

        }, 500)
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if ( !err ) {
                let fields = this.getAllFields();
                let payment = formula(fields)
                this.setState({
                    paymentSplit:payment.paymentSplit,
                    loan: computeLoan(fields),
                    monthlyPayment: payment.monthlyPayment,
                    amortization: payment.amortization
                });
            } else {
                console.log("err: " + err + " MortgageForm.js, 98");
            }
        });
    };

    getAllFields = () => {
        let fieldValFn = this.props.form.getFieldValue;
        let fields = {
            homePrice: fieldValFn('homePrice'),
            downPayment: fieldValFn("downPayment"),
            downPaymentPercent: fieldValFn("downPaymentPercent"),
            interestRate: fieldValFn("interestRate"),
            loanTerm: fieldValFn("loanTerm"),
            taxesPercent: fieldValFn("taxesPercent"),
            taxes: fieldValFn("taxes"),
            pmi: fieldValFn("pmi"),
            insurance: fieldValFn("insurance")
        };

        return fields;
    }

    validateStatus = (value) => {

        let validateHomePrice;
        let parsedVal = parseInput(value);
        let isPriceValid = true;

        if ( parsedVal < 5000 ) {
            isPriceValid = false;
            validateHomePrice = {
                validateStatus: 'error',
                errorMsg: "Incorrect Home Price"
            };
        } else {
            validateHomePrice = {
                validateStatus: 'success',
                errorMsg: null,
            };
        }

        this.setState({validateHomePrice});
        return isPriceValid;

    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={"form-root"}>
                <Form onSubmit={this.handleSubmit}
                      className="mortgage-form">
                    <Row gutter={8}>
                        <Col xs={24} sm={12} md={8} lg={6} style={{height: 'auto', minHeight: 'auto'}}>
                            <FormItem label="Home Price"
                                      validateStatus={this.state.validateHomePrice.validateStatus}
                                      help={this.state.validateHomePrice.errorMsg}
                            >
                                {getFieldDecorator('homePrice', {
                                    getValueFromEvent: (e) => {
                                        return processInput(e.target.value.replace(/\D/g, ""));
                                    },
                                    initialValue: this.state.homePrice,
                                    onChange: (e) => this.handleDownPaymentChange(e, "homePrice"),
                                    rules: [ {required: true} ],
                                })(
                                    <Input
                                        type="text"
                                        prefix={<span className={"inactive"}>$</span>}
                                        placeholder="Home Price"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} style={{height: 'auto', minHeight: 'auto'}}>
                            <Row className={"formItemP"}>
                                <Col xs={18} sm={18} md={18} lg={18}>
                                    <FormItem label="Down Payment">
                                        {getFieldDecorator('downPayment', {
                                            getValueFromEvent: (e) => {
                                                return processInput(e.target.value.replace(/\D/g, ""));
                                            },
                                            initialValue: this.state.downPayment,
                                            rules: [ {required: false} ],
                                            onChange: (e) => this.handleDownPaymentChange(e, 'downPayment'),
                                        })(
                                            <Input
                                                prefix={<span className={"inactive"}>$</span>}
                                                type="text" placeholder="Down Payment"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} className={"hide-label"}>
                                    <FormItem label=" ">
                                        {getFieldDecorator('downPaymentPercent', {
                                            // getValueFromEvent: ( e ) => {
                                            //     return processInput( e.target.value.replace( /\D/g, "" ) );
                                            // },
                                            initialValue: this.state.downPaymentPercent,
                                            rules: [ {required: false} ],
                                            onChange: (e) => this.handleDownPaymentChange(e, 'downPaymentPercent'),
                                        })(
                                            <Input type="text" placeholder="Down Payment, %"
                                                   suffix={<span className={"inactive"}>%</span>}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6} style={{height: 'auto', minHeight: 'auto'}}>
                            <FormItem label="Interest Rate">
                                {getFieldDecorator('interestRate', {
                                    // getValueFromEvent: (e) => {
                                    //     return processInput(e.target.value.replace(/\D/g, ""));
                                    // },
                                    initialValue: this.state.interestRate,
                                    rules: [ {required: true, message: 'Please add your an interest rate'} ],
                                })(<Input type="text" placeholder="Interest rate"
                                          suffix={<span className={"inactive"}>%</span>}
                                          onChange={(e) => this.handleFormChange(e, 'interestRate')}/>)}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={6}>
                            <FormItem label="Loan Term">
                                {getFieldDecorator('loanTerm', {
                                    initialValue: this.state.loanTerm,
                                    rules: [ {required: true, message: 'Please add your loan term'} ],
                                })(
                                    <Input
                                        type="text"
                                        placeholder="Loan Term"
                                        suffix={<span className={"inactive"}>/Years</span>}
                                        onChange={(e) => this.handleFormChange(e, 'loanTerm')}/>)}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8} style={{height: 'auto', minHeight: 'auto'}}>
                            <Row>
                                <Col xs={18} sm={18} md={18} lg={18}>
                                    <FormItem label="Property Tax">
                                        {getFieldDecorator('taxes', {
                                            getValueFromEvent: (e) => {
                                                return processInput(e.target.value.replace(/\D/g, ""));
                                            },
                                            initialValue: this.state.taxes,
                                            rules: [ {required: false} ],
                                        })(<Input type="text" placeholder="Taxes"
                                                  prefix={<span className={"inactive"}>$</span>}
                                                  suffix={<span className={"inactive"}>/Year</span>}
                                                  onChange={(e) => this.handleFormChange(e, 'taxes')}/>)}
                                    </FormItem>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} className={"hide-label"}>
                                    <FormItem label=" ">
                                        {getFieldDecorator('taxesPercent', {
                                            initialValue: this.state.taxesPercent,
                                            rules: [ {required: false} ],
                                            onChange: (e) => this.handleFormChange(e, 'taxesPercent'),
                                        })(
                                            <Input type="text" placeholder="Down Payment, %"
                                                   suffix={<span className={"inactive"}>%</span>}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8} style={{height: 'auto', minHeight: 'auto'}}>
                            <FormItem label={<span>
                            <Tooltip placement="topRight"
                                     title="Private Mortgage Insurance (PMI) will be added only if your down payment is less than 20%. It protects the lender in case you are not able to make your house payments."><i
                                className="fa fa-info-circle" style={{color: '#494949'}}/> </Tooltip>
                                Private Mortgage Insurance
                                </span>
                            }>
                                {getFieldDecorator('pmi', {
                                    initialValue: this.state.pmi,
                                    rules: [ {required: false} ],
                                })(<Input type="text" placeholder="Private Mortgage Insurance (PMI)"
                                          suffix={<span className={"inactive"}>%</span>}
                                          onChange={(e) => this.handleFormChange(e, 'pmi')}/>)}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <FormItem label="Home Insurance">
                                {getFieldDecorator('insurance', {
                                    getValueFromEvent: (e) => {
                                        return processInput(e.target.value.replace(/\D/g, ""));
                                    },
                                    initialValue: this.state.insurance,
                                    rules: [ {required: false} ],
                                })(<Input type="text" placeholder="Insurance"
                                          suffix={<span className={"inactive"}>/Year</span>}
                                          onChange={(e) => this.handleFormChange(e, 'insurance')}/>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem className={"left"}>
                        <Button
                            htmlType="submit"
                            className="calculate-button" onClick={this.handleSubmit}>
                            <i className="fa fa-calculator"/> Calculate</Button>
                    </FormItem>
                </Form>
                { this.props.form.getFieldValue("interestRate")!=="" &&
                    this.state.monthlyPayment > 0 && this.state.validateHomePrice.validateStatus !== "error" &&
                    <div>
                        <Card
                            title={<div>
                                <span className="row-name">Your loan: </span>
                                <strong className={"money"}>
                                    {this.state.loan}
                                </strong>
                            </div>}
                            bordered={true}
                        >
                            <h3>Monthly payment:</h3>
                            <div><span className="row-name">Tax:</span><span
                                className="money">{this.state.paymentSplit.taxes}</span>
                            </div>
                            <div><span
                                className="row-name">Home Insurance:</span><span
                                className="money">{this.state.paymentSplit.insurance}</span>
                            </div>
                            <div><span className="row-name">PMI:</span><span
                                className="money">{this.state.paymentSplit.pmi}</span>
                            </div>
                            <div><span className="row-name">Principal & Interest:</span><span
                                className="money">{this.state.paymentSplit.pi}</span>
                            </div>
                            <hr/>
                            <div><span
                                className="row-name">Your payment:</span><strong
                                className="money monthly">{this.state.monthlyPayment}/Month</strong>
                            </div>

                        </Card>
                        <br/>
                        <h2>Amortization Chart</h2>
                        <AmortizationChart data={this.state.amortization}/>
                    </div>
                }
            </div>

        )
            ;
    }
}

const WrappedMortgageForm = Form.create()(MortgageForm);

export default WrappedMortgageForm;
