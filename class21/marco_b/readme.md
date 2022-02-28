# DARK CHAOS - Project Description



## Outline
Dark Chaos is an atmospheric and cinematic project. Even before this project, I admired the music in films and always chose music for my own short films / videos very carefully. So this gave me already a feeling for atmosphere and how a track can progress in its mood. To prepare even more for my own creation, I listened again to some of Hans Zimmer's famous tracks, but also to some smaller composers which make their music without any context to films. While listening to the music, I tried to not just get the mood from the music, but also tried to figure out the specific elements that convey the different moods, e.g. tempo, choice of instruments, sound effects. I then incorporated some of the ideas in my own track. While the music is inspired by various film scores, the visuals are inspired by the classic simple look you can find at different music visualizers. Everything was done from scratch, no music loops and no pre-rendered images.


## Technical Choices

**The Music:**

To create the track, Ableton Live 11 was used. Most of the instruments and sound libraries were provided directly by Ableton. Two "hit" sound effects and one "riser" were used from external sources. Additionally the VST Plugin *LABS* from Spitfire was used for the string instruments. To get a better feeling for the program and the music creation, midi-tracks were "drawn" with a mouse instead of played with a midi-keyboard. This gave me more flexibility in adjusting tones and melodies, without having any prior knowledge in music composition.


**The Visuals:**

The music visualizer was coded with p5.js. The overall design consists of simple geometric shapes. The unique look is created through the placement and the modification by music and user input. By using the mouse, the user can start or stop the music, resize and rotate the shapes. To make it react to the music, a Fast-Fourier-Transformation is performed on the data from the sound file. The volume of different frequencies (the "energy") defines the size of the triangles. But each triangle reacts to a different range of frequencies. The color changes with the peaks of high frequencies. The right half of the circle in the background represents the waveform.


## Artistic Intention

The listener should be able to dive deep into a dark atmosphere. Therefore the music track starts slowly with deep and intimidating sounds. The suspense rises and then the "chaos" breaks out and it gets dramatic, by adding more and more instruments, increasing the volume and tempo. When I listen to music, it's always important for me, that I can have my own thoughts, ideas and story to the music. To offer this freedom tothe listener of my track as well, I created visuals that deliver the same atmosphere but is not too distracting. 

The dark atmosphere in the visuals is created by designing a space-inspired environment by adding small circels as stars. To add to the space-scenery, the semicircular visualizer of the waveform is inspired by the look of an eclipse. Space is an empty place and offers freedom but can also be intimidating, because we do not know what is out there. To increase the intimidating effect in the visuals, an abstract artifact fills out most of the scene. It's nothing organic or smooth that we might consider pleasant. Instead, it has sharp edges and straight lines and we can not associate anything specific with it. The louder the music gets, the more "aggressive" it moves - it grows and glows. 
To also incorporate the chaos aspect in the visuals, the user input is handled differently for each triangel. Not everything can be scaled and rotated, and those triangles that can be manipulated, react in opposite ways to the user input.


## Learnings and Reflections

I learned a lot about different aspects of music composition. I have neither created music myself before nor am i playing an instrument. At first I just played around with different sounds but somewhere on the way I got stuck, so I even tried to learn the basics of music theory. This helped me to progress my track. But I also learned how I can combine strict methods, e.g. chords, and just my feeling for the atmopshere. 

p5 was also new to me. I have coded before but not in a creative way, so it was very interesting as well to find out how I can use functionality and maths / sound analysis to influence my vision for a scene.

All in all I am happy with my result, I managed to reach my goal by creating an audiovisual experience conveying the mood I had in mind. Of course, there is still room to go further with it, by adding more details to the music and the scene, using own instruments and optimising the performance of the sketch if it gets bigger.
