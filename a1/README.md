# A1 Canvas
Name: Musab Mufti  
Email: m8mufti@uwaterloo.ca  
Student Number: 20992846  
<br>
Notes:  
- Using shift and arrow keys at the same time, if an increase or decrease of 10 is not available, the bar value changes as much as possible.
- Assumed no need for arrow key to be continually registered while keys are held down (i.e for the bar to keep changing size while key is down), since no indication was given this needs to be done.
- The types of animation (i.e. easing) needed were not made clear, so the details were inferred off of the video.
- For the 50px distance needed for a flick, the Pythagorean distance was used.
- Up to 30 degrees from horizontal are allowed for a flick.
- For the circle button hit testing, it is checked if the pointer is within the radius + 1 from the center, since the border of 2px expands outward 1px and inward 1px. This clearly works better in practice too.
- The demo video and specs did not say what happens when a bar is clicked and then something else (not a bar) is clicked. Here, the bars are treated as though have been "focused", matching the appearance. So, if anything other than the focused bar is clicked, the bar loses focus.