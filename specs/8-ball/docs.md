# Magic 8-Ball Project

## Intro:
Welcome to the documentation for the Magic 8 Ball game. This game is a web-based application that provides a mystical answer to any question asked by the user. The game simulates the experience of a Magic 8 Ball toy that is popular for its ability to give insightful and often entertaining responses to any query.

This documentation aims to provide a comprehensive guide on how to use the Magic 8 Ball game and its features. It will cover the HTML, CSS, and JavaScript code used to create the game and provide a brief overview of the game's functionality.

Whether you're looking to use the game for fun, inspiration, or creative problem-solving, this documentation will provide you with all the information you need to get started. So, let's dive in and explore the Magic 8 Ball game!

## How to Use:
The Magic 8 Ball game is easy to use and can be played by anyone. Follow these steps to get started:

Open the web page: To use the Magic 8 Ball game, you need to open the web page containing the game.

Type in your question: On the web page, you will see an input field labeled "Type in your question." Type in your question in this field.

Shake the ball: Once you have typed in your question, you need to shake the ball. To do this, click and hold the ball with your mouse and then move it in a back and forth motion. You can also shake your device if you are using a mobile device.

Get your answer: After shaking the ball, the answer to your question will appear on the ball. The answer will be displayed along with an image of the 8 Ball.

Play again: If you want to ask another question, simply type in a new question and shake the ball again.

That's it! Using the Magic 8 Ball game is that simple. You can use the game for fun, inspiration, or creative problem-solving. So, go ahead and ask your questions and see what the Magic 8 Ball has in store for you!

## Code Docs:
- index.html  
  
- style.css  

  - .ballwrapper: sets the height, width, position, and margins of the 8-ball container.
   
  - #ball: sets the height, width, background color, border radius, display, box shadow, text alignment, position, and z-index of the black and white ball in the 8-ball container.
    
  - .ballbackground: sets the width, height, position, and z-index of the 8-ball background in the 8-ball container.
    
  - .answer: sets the color, font family, font weight, font size, line height, text align, background color, padding, border radius, width, height, display, justify-content, align-items, text-shadow, box-shadow, margin, position, and z-index of the output/answer text box in the 8-ball container.
    
  - .graphic: sets the width, height, position, and z-index of the graphic area for the ball in the 8-ball container.
    
  - .instructions: sets the width and margin-bottom of the instructions text and centers it.
    
- script.js  
    
  - responses[]: An array containing 20 possible responses that the eight ball can give
    
  - predict(): A function that selects a random response from the responses array and displays it to the user. The function also converts the response into speech using the synth variable and types out the response one character at a time using the typeResponse function.
  
  - typeResponse(): A function that types out the eight ball's response one character at a time using the setInterval method.

  - ball/document EventListeners
    