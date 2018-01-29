export default ( userInput ) => {
    userInput = userInput + "";
    let processeduserInput = userInput.replace( /,/gi, "" )
    let parseFl;
    if ( processeduserInput.length === 0 ) {

        return 0;
    }

    parseFl = parseFloat( processeduserInput );


    return parseFl

}