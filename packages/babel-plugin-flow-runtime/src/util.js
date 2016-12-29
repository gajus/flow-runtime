/* @flow */

import _fs from 'fs';
import Bluebird from 'bluebird';

export const fs = Bluebird.promisifyAll(_fs);