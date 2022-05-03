const decodeMorse = function (morseCode) {
    let resultString = '';
    //MORSE_CODE['']
    let wordsArr = morseCode.split('   ');
    wordsArr.forEach(word => {
        word.split(' ').forEach(char => {
            resultString += MORSE_CODE[char];
        });
        resultString += ' ';
    });
    return resultString.trim();

}

console.log(decodeMorse('.... . -.--   .--- ..- -.. .'));