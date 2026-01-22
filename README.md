# Summary
Spelunk is a terminal based object crawler designed to provide an interactive way to navigate complex objects and make the correct selection when querying specific info. 
If you're like me and are a print programmer/debugger then spelunk may be of interest.

I decided to hammer spelunk out after getting fed up with complex object responses.
I'm sure VS Code ***Spits*** and others likely have better tools but I use nvim (..BTW).
Also I was slightly bored and thought it would be a fun project.

Spelunk also provides the ability to generate a ts type to mirror your object so OCD people don't have to lose sleep over "foo : any".

# How To
## Basic implementation
```
import spelunk from 'spelunk/mod.ts'

await spelunk(object);
```
Once run, spelunk will open an interactive prompt within the terminal to explore the object passed into it.

## Input Options
- q: Quit the program
- -: return to previous level
- p: copies the path of your current level to your system clipboard
- #: When followed by a number, updates the layers of the object to show i.e. #3 will show keys/values 3 layers down while #1 will show only the first layer keys/values.
- t: creates a ts type of the current structure and copies it to the system clipboard.

> [!Note]
> This type is only based on the object passed to spelunk, types not in the object will need to be added.

For objects: Type in the desired key to dive to that level.

For arrays: Typing the number of the element you want will go to that element. 
Alternatively, you can type \*(#) to indicate looping over all elements.  
(#) is an optional element number and will dive into that element if present, otherwise spelunk will default into element 0.

> [!important]
> As q, -, p, t, and # are special characters if your key is only one of those characters they must be escaped with \
> Additionally, any key beginning with a \ will need to be escaped with \

# To-dos
## Features
- Tab completion
- Add help menu
- Allow for dot notation in the pathing
- Reimplement showing the type tree
## Bugs
- When allowing access to run for the first time, deno permissions adds a line to the printed which throws off screen length.
- When displaying type tree, long trees result in throwing off terminal length, may need to happen in alt terminal.  
Feature has been removed temporarily.

