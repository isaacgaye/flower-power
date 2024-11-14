# Flower Power

A generative art project that simulates flower growth patterns with customizable parameters and color palettes. This project combines mathematical modeling with artistic visualization to create unique, organic-looking flower propagation patterns.

## Features
- Multiple generations of flower growth
- Customizable number of petals, scattering distance, and wind effect
- Custom color palette support
- Animation of growth process
- Zoom and pan controls
- Export as PNG

## Mathematical Process
The flower propagation follows a mathematical model based on several key principles:

1. **Initial State**: Begins with a single flower at origin (0,0)

2. **Growth Parameters**:
   - P (Petals): Number of seeds per flower (3-12)
   - SD (Scattering Distance): Base distance for seed dispersal (3-7 units)
   - G (Generations): Number of growth cycles (1-5)
   - W (Wind): Randomness factor (1-100%)

3. **Propagation Algorithm**:
   For each generation G:
   - Each flower produces P seeds
   - Seeds are placed around the parent flower in a circle of radius SD
   - Position variations are calculated using:
     - Angle = (2π × p/P) + gaussian_random(0, π/P × W/100)
     - Distance = SD + gaussian_random(0, SD × 0.2 × W/100)
   - Colors are determined by distance from origin

4. **Gaussian Distribution**:
   - Uses Box-Muller transform for natural-looking randomness
   - Creates more realistic seed dispersal patterns
   - Affects both angle and distance calculations

## Color Schemes
You can customize the color palette using hex codes. To create your own palette:

1. Visit [Coolors.co](https://coolors.co)
2. Generate or customize your palette
3. Click "Export" (top right)
4. Select "Code" tab
5. Copy the hex values without the '#' symbols
6. Paste as comma-separated values in the app's color input
   
Example: `eac435,345995,e40066,03cea4,fb4d3d`

Note: Colors will be interpolated based on distance from the center, transitioning smoothly between your selected colors.

## Usage
1. Adjust the sliders to modify the growth parameters
2. Enter custom color palettes as comma-separated hex codes
3. Click "Animate Growth" to see the generation process
4. Use mouse wheel to zoom and drag to pan
5. Save your creation as an image

## Development
This project uses vanilla JavaScript and HTML Canvas for rendering. No dependencies required.

## License
This project is licensed under the MIT License with an attribution requirement.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
2. Attribution must be given to the original author (Isaac Gaye) in any derivative works or public displays of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

## Credits
- Created by Isaac Gaye
- Mathematical modeling and implementation assistance from Anthropic's Claude AI

## Contributing
Contributions are welcome! Feel free to submit issues and pull requests.