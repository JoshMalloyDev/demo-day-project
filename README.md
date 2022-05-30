# demo-day-project
demo day project
ADHD Demo Day Project

Description: This is an app for those who live with ADHD. It uses data visualization to promote self-forgiveness, music to drive timers for tasks instead of alarms, computer-generated artwork to add creativity to the everyday process, and extra tools for when decision-making becomes an obstacle to your health.

SELF-FORGIVENESS
Before starting any task, the app will launch a modal that asks the user did you do X self-care thing before? 
As the user presses the continue button for each self-care prompt, it will store that “yes” or “no” answer to the database. 
The app will create a graph that displays how many self-care activities they engaged with that week
Purpose: Even if they didn’t accomplish their goal, there’s still so much invisible work that was accomplished that should also be recognized as a success. Usually, we work in binaries - where you either failed or succeeded at your task. I want to give users a different option that involves grace, and no judgment.
MUSIC AS TIME-REFS
Allow users to set a timer for a task
That time will be stored in the database
We will use the Spotify API to create a playlist, and randomly add songs from their account. As the songs add to this new playlist, we will log the playlist’s total time and stop adding songs when the playlist is around the timer amount
When the time is up, the playlist will stop playing and a notification will alert them 
They have the option to set another timer and do it again
Purpose: alarms are very easy to shew away. Generating music will create a flow state for the user, and removing the flow state (by stopping the music) can create a similar effect that a timer has on a neurotypical person
ARTWORK
When a user designates a task to track, they are asked to assign that task a specific color. The color and task will be stored in the database
Uses p5.js to create graffiti-like strokes (all strokes should have varying opacity levels)
The assigned color will be passed to the p5.js API and the more days that you have accomplished your tasks, the longer the API holds the mouse down and creates a brush stroke (the x-axis and y-axis of the brush strokes will all be randomly generated to create variety in strokes)
By the end of the week, there should be a square with various different colored brush strokes on this square
The background of the square will be a very-low-opacity, randomly-generated background color to prime the “painting”
When the week is over, the page will display their square painting
There will be a section filled with these weekly cover arts titled by that specific week
Purpose: to add some creativity and possible motivation to keep accomplishing tasks
“CAN YOU CHOOSE FOR ME?”
A user is able to upload simple recipes they can think of and the ingredients it takes to make it
Foods can be labeled breakfast, lunch, and dinner
When a user is struggling to decide what to eat, they press a “choose for me” button 
The button stores the current time of the click, and if its before noon, then the app randomly displays a breakfast food, if its from 12pm to 5pm it’ll display a random lunch recipe, and if its from 5pm-1am, it’ll display a random dinner option (maybe it's not till 1am?)
Purpose: take care of your body and health without letting anxiety stop or delay you
“WHERE YOU AT?” 
***Maybe I’ll use this but maybe I won't, depending on time and if it fits…
Use a GeoTracker to calculate someone’s latitude and longitude every second 
Use a googled formula to convert the total distance into mm
Use a googled formula to convert mm into approximate steps taken
Every time someone presses the “pause task” button, the app tracks their steps
When they press “continue” the app tells them how many steps they’ve taken in that time
Purpose: “This is how many steps you’ve taken and how far you’ve strayed from X task”
