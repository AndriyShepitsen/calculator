import parseInput from "./parseInput";
import processInput from "./processInput";

export default ( fields ) => {
    let homePrice = parseInput( fields.homePrice );
    let downPayment = parseInput( fields.downPayment);


    let loan = processInput(homePrice - downPayment);



    return loan

}