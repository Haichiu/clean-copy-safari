import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanURL} from '../extension/clean-url.js';

test('keeps signed URLs byte-for-byte, including covered tracking fields', () => {
 for(const signature of ['Signature=sig&Key-Pair-Id=id&Expires=2000000000','X-Amz-Signature=sig','X-Goog-Signature=sig','sig=azure']) {
  const url=`https://example.com/file?filename=a%20b&utm_source=mail&${signature}#part`;
  assert.deepEqual(cleanURL(url),{url,removed:0});
 }
});
test('a no-op does not normalize query encoding or trailing delimiters', () => {
 for(const url of ['https://example.com/?q=a%20b&x=~','https://example.com/path?','https://example.com/?x=%2f']) assert.deepEqual(cleanURL(url),{url,removed:0});
});
