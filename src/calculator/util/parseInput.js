export default ( userInput ) => {
    userInput = userInput + "";
    let processeduserInput = userInput.replace( /,/gi, "" )


    return parseFloat( processeduserInput );

}