# Swatch Finder [see it here](https://dangervalentine.github.io/javascript-swatch-finder/)

This will look at an image file that has been uploaded to it and return to you a palette of colors found within that image. The colors will be weighed so that those which appear more often will be returned larger than those that are not.

---

![Easy palette produced by five bold colors](https://raw.githubusercontent.com/victoriousj/javascript-swatch-finder/master/src/example.PNG)

---

## Usage

Use Git to clone the repository. Open the solution in Visual Studio if you want to develop it.

```bash
git clone https://github.com/victoriousj/javascript-swatch-finder.git
```

## About

I wanted to be able to take photos on my phone and quickly see what the hex value of a color around me would be. This works pretty well on both mobile and regular browsers.

## How It Works

Starting with inputing your file, the program will compress the photo down so that it is less than one-hundredth it normal size. When it gets this small, it will lose a lot of details that you would want in a photo you would be viewing, but when we blow this photo back up to its regular size, without allowing the browser to smooth out the harsh pixel edges, we get a rough representation of what the image originally looked like.

![Two of the same images, one is the original and the other is a rough pixel version of the same photo](https://raw.githubusercontent.com/victoriousj/javascript-swatch-finder/master/src/pixelate.png)

When we do this, we now have clear borders between colors instead of millions of slightly different pixels. We will then iterate over each of these color blocks, create an object with Red, Green, and Blue properties on it that correspond to the color of the block and then add this object to an array. Once we have gone over each block, we will go over this array and determine if there are any similiar colors which we can group together.

We determine if colors are similiar by finding the delta between their color code's corresponding Hex value. Red's hex value is FF0000. That means, if we were to convert this value to values for red, green, and blue (the primary colors of a pixel) we would have a value of 255 for red, 0 for green, and 0 for blue. We would take this value and run through the array trying to find some thing close to this value (255,0,0) with a corresponding relationship stronger than a 90% association. The code for comparing two colors is as follows:

```javascript
const colorDelta = (hex1, hex2) => {
    // get red/green/blue int values of hex1
    var r1 = parseInt(hex1.substring(0, 2), 16);
    var g1 = parseInt(hex1.substring(2, 4), 16);
    var b1 = parseInt(hex1.substring(4, 6), 16);
    // get red/green/blue int values of hex2
    var r2 = parseInt(hex2.substring(0, 2), 16);
    var g2 = parseInt(hex2.substring(2, 4), 16);
    var b2 = parseInt(hex2.substring(4, 6), 16);
    // calculate differences between reds, greens and blues
    var r = 255 - Math.abs(r1 - r2);
    var g = 255 - Math.abs(g1 - g2);
    var b = 255 - Math.abs(b1 - b2);
    // limit differences between 0 and 1
    r /= 255;
    g /= 255;
    b /= 255;
    // 0 means opposite colors, 1 means same colors
    return (r + g + b) / 3;
};
```

If two colors have a greater than 90% association (that 90% being arbitrarily chosen) than we remove the second occurence and add to the 'weight' property on the original color so that we can show a color appearing more than once when we display the results.

After we are done with that, we display both the photo and the swatch found in the process.

Users are free to click on a color and the hex value of the color will be copied to the clipboard for design use.

There are two known problems with this program:

-   if there are hard lines between colors, the pixelation process may place a pixel block right between these two values, giving a color that is half of both
-   if the user is on mobile and takes a photo, for the input file, the initial photo will work but a second one will not

These may be addressed but I'm happy with how this works currently, so I may leave this as is.

## License

[MIT](https://choosealicense.com/licenses/mit/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
