export default (loan) => {

    console.log( "loan: " + JSON.stringify( loan, null, 2 ) + "formula.js, 3" );

    let monthlyInter = (loan.interestRate / 12)/100;
    let numberOfMonth = loan.loanTerm * 12;

    let totalLoanAmount = loan.loanAmount + loan.loanTerm * (loan.taxes + loan.insurance);

    console.log( "totalLoanAmount: " + totalLoanAmount + " formula.js, 10" );

    let monthlyPayment = totalLoanAmount*((monthlyInter*Math.pow(1+monthlyInter, numberOfMonth))/(Math.pow(1+monthlyInter, numberOfMonth)-1));

    monthlyPayment=monthlyPayment.toFixed(2)

    return monthlyPayment;

}