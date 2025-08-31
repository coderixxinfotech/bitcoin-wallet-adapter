// What happens in this file:
// - Initializes bitcoinjs-lib ECC implementation for tests to satisfy bip322-js requirements
// - Prevents "ecc library invalid" during Jest runs
import * as ecc from 'tiny-secp256k1';
import { initEccLib } from 'bitcoinjs-lib';

try {
  // tiny-secp256k1 requires Node crypto; this is fine in Jest/node
  // Initialize only once
  // @ts-ignore - runtime guard
  if (!(global as any).__bwaEccInited) {
    initEccLib(ecc as any);
    // @ts-ignore
    (global as any).__bwaEccInited = true;
  }
} catch (e) {
  // In case environment lacks required primitives, tests that rely on bip322-js will be skipped by failing early.
  // But avoid crashing whole suite here.
  // eslint-disable-next-line no-console
  console.warn('[tests/setupTests] ECC init warning:', (e as Error)?.message);
}
