import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import debounce from 'lodash.debounce';
import formula from "./formula"
import AmortizationChart from "./AmortizationChart";
import processInput from "./util/processInput";
import parseInput from "./util/parseInput";

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {

    state = {
        amortization: [],
        homePrice: "100,000",
        downPayment: "20,000",
        downPaymentPercent: 20,
        interestRate: 3,
        loanTerm: 30,
        taxes: "5,000",
        pmi: .65,
        insurance: 800,
        monthlyPayment: 0
    }

    componentDidMount() {
        let fields = this.getAllFields();
        let payment = formula( fields )

        this.setState( {
            monthlyPayment: payment.monthlyPayment,
            amortization: payment.amortization
        } );
    }


    handleFormChange = ( e, name ) => {
        let value = parseFloat( e.target.value );
        this.setState( {
            [name]: value
        }, () => {
            let fields = this.getAllFields();
            let payment = formula( fields )
            this.setState( {
                monthlyPayment: payment.monthlyPayment,
                amortization: payment.amortization
            } );

        } );

    }

    handleDownpaymentChange = ( e, name ) => {

        let value = parseInput( ( e.target.value ) );
        var downPayment, downPaymentPercent, homePrice;

        switch (name) {
            case "homePrice":
                homePrice = value;
                let homePriceparsed = parseInt( homePrice );
                if ( homePriceparsed > 0 ) {
                    downPayment = parseInput( this.props.form.getFieldValue( "downPayment" ) );
                    downPaymentPercent = ( (downPayment / homePrice * 100) ).toFixed( 2 ).replace( ".00", "" )
                    let downPaymentPercentParsed = parseFloat( downPaymentPercent );

                    if ( downPaymentPercentParsed > 100 ) {
                        downPaymentPercentParsed = parseFloat( this.props.form.getFieldValue( "downPaymentPercent" ) );
                        downPayment = processInput(homePriceparsed * (downPaymentPercentParsed / 100))
                        this.props.form.setFieldsValue( {downPayment} )
                    } else {
                        this.props.form.setFieldsValue( {downPaymentPercent} )
                    }


                }
                break;
            case "downPayment":
                downPayment = value
                homePrice = parseInput( this.props.form.getFieldValue( "homePrice" ) );
                if ( homePrice > 0 ) {
                    downPaymentPercent = ( (downPayment / homePrice * 100) ).toFixed( 2 ).replace( ".00", "" )
                    this.props.form.setFieldsValue( {downPaymentPercent} )
                }
                break;
            case "downPaymentPercent":
                downPaymentPercent = value;
                let number = parseInt( downPaymentPercent );

                if ( number > 20 ) {
                    this.props.form.setFieldsValue( {pmi: 0} )
                } else {
                    this.props.form.setFieldsValue( {pmi: 0.65} )
                }
                homePrice = parseInput( this.props.form.getFieldValue( "homePrice" ) );
                downPayment = (( downPaymentPercent * homePrice ) / 100);
                this.props.form.setFieldsValue( {downPayment: processInput( downPayment )} )

                break;
            default:
                console.log( "Unrecongnized change for downpayment computations" )
        }

        setTimeout( () => {
            let fields = this.getAllFields();
            let payment = formula( fields )
            this.setState( {
                monthlyPayment: payment.monthlyPayment,
                amortization: payment.amortization
            } );

        }, 500 )


    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( ( err, values ) => {
            if ( !err ) {
                let fields = this.getAllFields();
                let payment = formula( fields )
                this.setState( {
                    monthlyPayment: payment.monthlyPayment,
                    amortization: payment.amortization
                } );
            } else {
                console.log( "err: " + err + " MortgageForm.js, 98" );
            }
        } );


    }

    getAllFields = () => {
        let fieldValFn = this.props.form.getFieldValue;
        let fields = {
            homePrice: fieldValFn( 'homePrice' ),
            downPayment: fieldValFn( "downPayment" ),
            downPaymentPercent: fieldValFn( "downPaymentPercent" ),
            interestRate: fieldValFn( "interestRate" ),
            loanTerm: fieldValFn( "loanTerm" ),
            taxes: fieldValFn( "taxes" ),
            pmi: fieldValFn( "pmi" ),
            insurance: fieldValFn( "insurance" )
        };

        return fields;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={{padding: '0px 5px'}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Row gutter={8}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <FormItem label="Home Price">
                                {getFieldDecorator( 'homePrice', {
                                    getValueFromEvent: ( e ) => {
                                        return processInput( e.target.value.replace( /\D/g, "" ) );
                                    },
                                    initialValue: this.state.homePrice,
                                    onChange: ( e ) => this.handleDownpaymentChange( e, "homePrice" ),
                                    rules: [ {
                                        required: false
                                    } ],
                                } )(
                                    <Input placeholder="Home Price"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <FormItem label="Down Payment">
                                {getFieldDecorator( 'downPayment', {
                                    getValueFromEvent: ( e ) => {
                                        return processInput( e.target.value.replace( /\D/g, "" ) );
                                    },
                                    initialValue: this.state.downPayment,
                                    rules: [ {required: false} ],
                                    onChange: ( e ) => this.handleDownpaymentChange( e, 'downPayment' ),
                                } )(
                                    <Input type="text" placeholder="Down Payment"/>
                                )}
                            </FormItem>
                            <FormItem label="%">
                                {getFieldDecorator( 'downPaymentPercent', {
                                    getValueFromEvent: ( e ) => {
                                        return processInput( e.target.value.replace( /\D/g, "" ) );
                                    },
                                    initialValue: this.state.downPaymentPercent,
                                    rules: [ {required: false} ],
                                    onChange: ( e ) => this.handleDownpaymentChange( e, 'downPaymentPercent' ),
                                } )(
                                    <Input type="text" placeholder="Down Payment, %"/>
                                )}
                            </FormItem>

                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <FormItem label="Interest Rate">
                                {getFieldDecorator( 'interestRate', {
                                    getValueFromEvent: ( e ) => {
                                        return processInput( e.target.value.replace( /\D/g, "" ) );
                                    },
                                    initialValue: this.state.interestRate,
                                    rules: [ {required: true, message: 'Please input your an interest rate'} ],
                                } )

                                (
                                    <Input type="text" placeholder="Interest rate"
                                           onChange={( e ) => this.handleFormChange( e, 'interestRate' )}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={6}>
                            <FormItem label="Loan Term">
                                {getFieldDecorator( 'loanTerm', {

                                    initialValue: this.state.loanTerm,
                                    rules: [ {required: true, message: 'Please input your loan term'} ],
                                } )

                                (
                                    <Input type="text" placeholder="Loan Term"
                                           onChange={( e ) => this.handleFormChange( e, 'loanTerm' )}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <FormItem label="Taxes">
                                {getFieldDecorator( 'taxes', {
                                    getValueFromEvent: ( e ) => {
                                        return processInput( e.target.value.replace( /\D/g, "" ) );
                                    },
                                    initialValue: this.state.taxes,
                                    rules: [ {required: false} ],
                                } )

                                (
                                    <Input type="text" placeholder="Taxes"
                                           onChange={( e ) => this.handleFormChange( e, 'taxes' )}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <FormItem label="Private Mortgage Insurance">
                                {getFieldDecorator( 'pmi', {

                                    initialValue: this.state.pmi,
                                    rules: [ {required: false} ],
                                } )

                                (
                                    <Input type="text" placeholder="Private Mortgage Insurance"
                                           onChange={( e ) => this.handleFormChange( e, 'pmi' )}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={8}>
                            <FormItem label="Home Insurance">
                                {getFieldDecorator( 'insurance', {
                                    getValueFromEvent: ( e ) => {
                                        return processInput( e.target.value.replace( /\D/g, "" ) );
                                    },
                                    initialValue: this.state.insurance,
                                    rules: [ {required: false} ],
                                } )

                                (
                                    <Input type="text" placeholder="Insurance"
                                           onChange={( e ) => this.handleFormChange( e, 'insurance' )}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem style={{textAlign: "left"}}>
                        <Button htmlType="submit"
                                className="login-form-button" onClick={this.handleSubmit}>Calculate</Button>
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

const WrappedNormalLoginForm = Form.create()( NormalLoginForm );

export default WrappedNormalLoginForm;
