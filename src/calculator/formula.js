let calculatePayment = ( principal, years, rate, taxes, insurance, pmiRate, downPaymentPercent ) => {
    let monthlyPaymentWithPmi;
    let monthlyRate = rate / 100 / 12;
    let monthlyPayment = principal * monthlyRate / (1 - (Math.pow( 1 / (1 + monthlyRate), years * 12 )));

    let monthlyPaymentFinal = monthlyPayment + (taxes + insurance) / 12;

    let balance = principal;
    let initialLoanAmount = principal;

    let amortization = [];
    let pmi = 0;
    let lvt = 0;
    for ( let y = 0; y < years; y++ ) {
        let interestY = 0;  //Interest payment for year y
        let principalY = 0; //Principal payment for year y
        for ( let m = 0; m < 12; m++ ) {
            let interestM = balance * monthlyRate;       //Interest payment for month m
            let principalM = monthlyPayment - interestM; //Principal payment for month m
            interestY = interestY + interestM;
            principalY = principalY + principalM;
            balance = balance - principalM;

            lvt = balance / initialLoanAmount

            if ( lvt > .8 ) {
                pmi += balance * pmiRate / 100;
            }
        }


        amortization.push( {principalY: principalY, interestY: interestY, balance: balance} );
    }
    let mPmi = 0;
    if ( downPaymentPercent < 20 ) {
        mPmi = pmi / (years * 12);

        monthlyPaymentWithPmi = monthlyPaymentFinal + mPmi;
    } else {
        monthlyPaymentWithPmi = monthlyPaymentFinal
    }

    let mTaxes = parseFloat( (taxes / 12).toFixed( 2 ) );
    let mInsurance = parseFloat( (insurance / 12).toFixed( 2 ) );
    mPmi = parseFloat( mPmi.toFixed( 2 ) );

    let paymentSplit = {
        taxes: mTaxes,
        insurance: mInsurance,
        pmi: mPmi,
        pi: parseFloat( (monthlyPaymentWithPmi - mTaxes - mInsurance - mPmi).toFixed( 2 ) )


    };


    return {monthlyPayment: monthlyPaymentWithPmi.toFixed( 2 ), paymentSplit, amortization: amortization};
};

export default ( loan ) => {
    let parsedLoan = {};

    for ( let key in loan ) {
        let parseFloat2 = parseFloat( (loan[ key ] + "").replace( /,/gi, "" ) );
        parsedLoan[ key ] = isNaN( parseFloat2 ) ? 0 : parseFloat2
    }


    return calculatePayment( parsedLoan.homePrice - parsedLoan.downPayment, parsedLoan.loanTerm, parsedLoan.interestRate, parsedLoan.taxes, parsedLoan.insurance, parsedLoan.pmi, loan.downPaymentPercent )

}

