# kraSyn
My submission to js1k/2014

Features a raymarched sphere field and a polyphone softsynth with polyrhythmic patterns.
Voices are modulated pulses.

This is the version which compresses down to 1019 bytes. It only runs on chrome however.
The branch 'compatible' contains a version which runs on chrome/FF but is larger than 1024b
due to the web audio api being very verbose.

I submitted this to the ++ compo.

# Raymarching
http://iquilezles.org/www/articles/terrainmarching/terrainmarching.htm
http://9bitscience.blogspot.ch/2013/07/raymarching-distance-fields_14.html

# Perlin Noise
http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
http://webstaff.itn.liu.se/~stegu/TNM022-2005/perlinnoiselinks/perlin-noise-math-faq.html#algorithm

# PRNG
http://stackoverflow.com/questions/521295/javascript-random-seeds
