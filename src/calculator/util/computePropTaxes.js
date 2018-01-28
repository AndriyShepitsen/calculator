import parseInput from "./parseInput";
import processInput from "./processInput";

export default ( fields ) => {

    let homePrice = parseInput( fields.homePrice );

    let taxPercentRaw = fields.taxesPercent;

    let taxesPerc = parseInput( taxPercentRaw / 100 );


    let taxes = Math.round(taxesPerc * homePrice);


    return processInput(taxes)

}