export const HOME_CAMERA=Object.freeze({position:[10,10,13],target:[0,0,0]});
export function cameraForBuilding(position){if(!Array.isArray(position)||position.length!==3||!position.every(Number.isFinite))throw new TypeError('Building position must be three finite numbers');const [x,,z]=position;return {target:[x,.65,z],position:[x+9,9.65,z+12]}}
export function isValidExternalUrl(value){if(typeof value!=='string')return false;try{return ['http:','https:'].includes(new URL(value).protocol)}catch{return false}}
