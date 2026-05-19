import * as fs from 'fs';
import * as path from 'path';

fs.renameSync('public/pogo/RL1.png', 'public/RL1.png');
fs.renameSync('public/pogo/RL1N.png', 'public/RL1N.png');
console.log('moved');
