var jimp = require('jimp');

async function main() {
  const image = await jimp.read('f.png');

  // image.circle();
  // or
  image.circle({ radius: 50, x: 25, y: 25 });
  image.write('fout.png');
}

main();