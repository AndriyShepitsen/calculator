let calculatePayment = (principal, years, rate, taxes, insurance, pmiRate) => {
    let monthlyRate = rate / 100 / 12;
    let monthlyPayment = principal * monthlyRate / (1 - (Math.pow(1 / (1 + monthlyRate), years * 12)));

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


        amortization.push({principalY: principalY, interestY: interestY, balance: balance});
    }

    let monthlyPaymentWithPmi = monthlyPaymentFinal + pmi / (years * 12);

    return {monthlyPayment: monthlyPaymentWithPmi.toFixed(2), amortization: amortization};
};

export default (loan) => {

    return calculatePayment(loan.loanAmount, loan.loanTerm, loan.interestRate, loan.taxes, loan.insurance, loan.pmi)

}

