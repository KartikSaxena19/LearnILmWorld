// utils/zegoToken.js
import crypto from 'crypto'

// Internal helpers

function RndNum(a, b) {
  return Math.ceil((a + (b - a)) * Math.random())
}

function makeRandomIv() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let iv = ''
  for (let i = 0; i < 16; i++) {
    iv += chars[Math.floor(Math.random() * chars.length)]
  }
  return iv
}

function getAlgorithm(key) {
  const keyBuf = Buffer.from(key)
  switch (keyBuf.length) {
    case 16: return 'aes-128-cbc'
    case 24: return 'aes-192-cbc'
    case 32: return 'aes-256-cbc'
    default:
      throw new Error(`Invalid ServerSecret length: ${keyBuf.length}`)
  }
}

function aesEncrypt(plainText, key, iv) {
  const cipher = crypto.createCipheriv(
    getAlgorithm(key),
    Buffer.from(key),
    Buffer.from(iv)
  )
  cipher.setAutoPadding(true)
  return Buffer.concat([
    cipher.update(plainText),
    cipher.final()
  ])
}

// ZEGO Token Generator
export function generateToken04(
  appId,
  userId,
  serverSecret,
  effectiveTimeInSeconds,
  payload = ''
) {
  if (!appId || typeof appId !== 'number')
    throw new Error('appID invalid')

  if (!userId || typeof userId !== 'string')
    throw new Error('userId invalid')

  if (!serverSecret || typeof serverSecret !== 'string' || serverSecret.length !== 32)
    throw new Error('ServerSecret must be a 32-character string')

  if (!effectiveTimeInSeconds || typeof effectiveTimeInSeconds !== 'number')
    throw new Error('effectiveTimeInSeconds invalid')

  const ctime = Math.floor(Date.now() / 1000)

  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: RndNum(-2147483648, 2147483647),
    ctime,
    expire: ctime + effectiveTimeInSeconds,
    payload
  }

  const plainText = JSON.stringify(tokenInfo)
  const iv = makeRandomIv()
  const encrypted = aesEncrypt(plainText, serverSecret, iv)

  const buf = Buffer.concat([
    Buffer.alloc(8),              // expire time
    Buffer.alloc(2),              // iv length
    Buffer.from(iv),              // iv
    Buffer.alloc(2),              // encrypted length
    encrypted                     // encrypted payload
  ])

  buf.writeBigInt64BE(BigInt(tokenInfo.expire), 0)
  buf.writeUInt16BE(iv.length, 8)
  buf.writeUInt16BE(encrypted.length, 10 + iv.length)

  return `04${buf.toString('base64')}`
}
