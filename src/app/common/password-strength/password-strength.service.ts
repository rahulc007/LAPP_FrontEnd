import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {
  m_strUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  m_strLowerCase = "abcdefghijklmnopqrstuvwxyz";
  m_strNumber = "0123456789";
  m_strCharacters = "!@#$%^&*?_~"
  constructor() { }

  runPassword(strPassword) {
    var nScore = 0;

    // Password length
    // -- Less than 4 characters
    if (strPassword.length < 5) {
      nScore += 5;
    }
    // -- 5 to 7 characters
    else if (strPassword.length > 4 && strPassword.length < 8) {
      nScore += 10;
    }
    // -- 8 or more
    else if (strPassword.length > 7) {
      nScore += 25;
    }

    // Letters
    var nUpperCount = this.countContain(strPassword, this.m_strUpperCase);
    var nLowerCount = this.countContain(strPassword, this.m_strLowerCase);
    var nLowerUpperCount = nUpperCount + nLowerCount;
    // -- Letters are all lower case
    if (nUpperCount == 0 && nLowerCount != 0) {
      nScore += 10;
    }
    // -- Letters are upper case and lower case
    else if (nUpperCount != 0 && nLowerCount != 0) {
      nScore += 20;
    }

    // Numbers
    var nNumberCount = this.countContain(strPassword, this.m_strNumber);
    // -- 1 number
    if (nNumberCount == 1) {
      nScore += 10;
    }
    // -- 3 or more numbers
    if (nNumberCount >= 3) {
      nScore += 20;
    }

    // Characters
    var nCharacterCount = this.countContain(strPassword, this.m_strCharacters);
    // -- 1 character
    if (nCharacterCount == 1) {
      nScore += 10;
    }
    // -- More than 1 character
    if (nCharacterCount > 1) {
      nScore += 25;
    }

    // Bonus
    // -- Letters and numbers
    if (nNumberCount != 0 && nLowerUpperCount != 0) {
      nScore += 2;
    }
    // -- Letters, numbers, and characters
    if (nNumberCount != 0 && nLowerUpperCount != 0 && nCharacterCount != 0) {
      nScore += 3;
    }
    // -- Mixed case letters, numbers, and characters
    if (nNumberCount != 0 && nUpperCount != 0 && nLowerCount != 0 && nCharacterCount != 0) {
      nScore += 5;
    }


    return nScore;
  }

  // Runs password through check and then updates GUI 


  scorePassword(strPassword) {
    // Check password
    var nScore = this.runPassword(strPassword);

    let strText = '';
    let strColor = '';
    if (nScore >= 90) {
      strText = "Very Secure";
      strColor = "#0ca908";
    }
    // -- Secure
    else if (nScore >= 80) {
      strText = "Secure";
      strColor = "#7ff67c";
    }
    // -- Very Strong
    else if (nScore >= 80) {
      strText = "Very Strong";
      strColor = "#008000";
    }
    // -- Strong
    else if (nScore >= 60) {
      strText = "Strong";
      strColor = "#006000";
    }
    // -- Average
    else if (nScore >= 40) {
      strText = "Average";
      strColor = "#e3cb00";
    }
    // -- Weak
    else if (nScore >= 20) {
      strText = "Weak";
      strColor = "#Fe3d1a";
    }
    // -- Very Weak
    else {
      strText = "Very Weak";
      strColor = "#e71a1a";
    }
    return{
      strColor:strColor,
      strText:strText
    }
  }

  // Checks a string for a list of characters
  countContain(strPassword, strCheck) {
    // Declare variables
    var nCount = 0;

    for (let i = 0; i < strPassword.length; i++) {
      if (strCheck.indexOf(strPassword.charAt(i)) > -1) {
        nCount++;
      }
    }

    return nCount;
  }


}
