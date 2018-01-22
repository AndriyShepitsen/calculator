export default ( userInput ) => {
    let processeduserInput = userInput.replace( /,/gi, "" )


    return parseFloat( processeduserInput );

}