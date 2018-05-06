module.exports = {

  randRange: (min, max) => {
    if(max == null) max = 0
    if(max < min) max,min=min,max
    return Math.floor(Math.random() * (max-min) + min)
  },

  htmlEntities: (str) => {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  pad(str, width, fillWith = " ", leftSide = true  ) {
    let ans = str;
    while(ans.length < width) {
      if(leftSide)		ans = fillWith + ans;
      else						ans = ans + fillWith;
    }
    return ans;
  },

  padZero: (str) => {
    return pad(str, 2, "0");
  },

  hslToRgb(hsl) {
    let H = hsl[0];
    let S = hsl[1];
    let L = hsl[2];

    let C, X, m;
    C = (1 - Math.abs(2 * L - 1) ) * S;
    X = C * (1 - Math.abs(mod(H / 60, 2)- 1));
    m = L - C / 2;

    let rgbPrime = { red: 0, green: 0, blue: 0};
    if(H < 60) {
      rgbPrime.red = C;
      rgbPrime.green = X;
    } else if (H < 120) {
      rgbPrime.red = X;
      rgbPrime.green = C;
    } else if (H < 180) {
      rgbPrime.red = 0;
      rgbPrime.green = C;
      rgbPrime.blue = X;
    } else if (H < 240) {
      rgbPrime.red = 0;
      rgbPrime.green = X;
      rgbPrime.blue = C;
    } else if (H < 300) {
      rgbPrime.red = X;
      rgbPrime.green = 0;
      rgbPrime.blue = C;
    } else if (H <= 360) {
      rgbPrime.red = C;
      rgbPrime.green = 0;
      rgbPrime.blue = X;
    }

    let rgb = {
      red: Math.round((rgbPrime.red + m)* 255),
      green: Math.round((rgbPrime.green + m)* 255),
      blue: Math.round((rgbPrime.blue + m)* 255)
      };

    let r = rgb.red.toString(16),
      g = rgb.green.toString(16),
      b = rgb.blue.toString(16);

    let rgbHex = "#" + padZero(r) + padZero(g) + padZero(b);
    return rgbHex;
  }

}
