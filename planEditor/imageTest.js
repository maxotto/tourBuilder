const MergeImg = require('merge-img');
const Fs = require('fs-extra');
const Path = require('path');
const sides = [
  'f',
  'r',
  'b',
  'l',
];
const filesToDelete = [];
const panoFolder = 'E:\\KR_WC\\224HollywoodAve\\outFolder\\panos\\IMG_20180929_173213_148.tiles';
const size1 = 512;
const size2 = 128;

function rowPromise(side, part){
  const root = Path.resolve(panoFolder, side);
  let y = 0;
  let tiles = [1,2,3];
  const tCollection = [];
  tiles.forEach(tile=>{
    //let x = (-1) * size1 * (tile);
    let x = 0;
    let imageFolder = Path.resolve(root, 'l1', String(part));
    let imageFileName = 'l1_' + side + '_' + String(part) + '_' + String(tile) + '.jpg';
    tCollection.push({
      src: Path.resolve(imageFolder, imageFileName),
      offsetX: x,
      offsetY: y,
    })
  });
  return MergeImg(tCollection)
    .then((img) => {
      return writeAsync(img, side+'_l1_' + part + '.png').catch(err => console.log(err));
    });
}

function writeAsync(img, file){
  return new Promise((resolve, reject) => {
    img.write(file, (err, img) => {
      if(!err) {
        filesToDelete.push(file);
        resolve(file);
      } else {
        reject(err);
      }
    });
  });
}
function composeSidePromise(side){
  const parts = [1,2,3];
  let promises = [];
  parts.forEach(part => {
    promises.push(rowPromise(side, part));
  });
  return Promise.all(promises)
    .then(result=>{
      return MergeImg(result, {direction: true})
    })
    .then(img => {
      return Promise.resolve(img);
    })
    .then(img => {
      return writeAsync(img, side + '.png');
    }) ;
}
const promises = [];
sides.forEach(side=>{
  const p = composeSidePromise(side);
  promises.push(p);
});

Promise.all(promises)
  .then(files => {
      return MergeImg(files)
    }
  )
  .then(img => {
    writeAsync(img, 'panorama.png');
  })
  .then(finalFile => {
    filesToDelete.forEach((file) => {
      if(file !== finalFile){
        // Fs.remove(file);
      }
    });
    }
  )
  .catch(err => console.log(err));
