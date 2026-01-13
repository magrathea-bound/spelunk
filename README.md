# Summary
Spelunk is an terminal based object crawler designed to provide an interactive way to navigate complex objects and make the correct selection when querying specific info. 
If you're like me and are a console.log programmer/debugger then spelunk may be of interest.

A project I decided to hammer out after getting fed up with complex API responses.
I'm sure there are better alternatives likely in VS Code *Spits* but I use nvim (BTW) and also wanted to mess around with TS a little.

# How To
## Basic implementation
```
import { spelunk } from 'spelunk/main.ts'

spelunk(object);
```
Once run, spelunk will open an interactive within the terminal to explore the object passed into it.

## Options
- q: Quit the program
- -: return to previous level

For objects: Type in the next key to dive to that level.
For arrays: Typing the number of the element you want to go to will go to that element. 
Alternatively, you can type \*(#) to indicate looping over all elements.  
(#) is an optional element number and will dive into that element if present, otherwise spelunk will default into element 0.


# To-dos
- copy object path to clipboard
- compile object typing for ts type
    - copy object type to clipboard
- Tab completion?

