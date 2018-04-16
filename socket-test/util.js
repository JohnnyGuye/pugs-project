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
  }
}
