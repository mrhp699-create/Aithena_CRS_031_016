const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'access-secret-key', {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m', // 15 minutes
    issuer: 'aithena-lms',
    audience: 'aithena-users'
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh-secret-key', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d', // 7 days
    issuer: 'aithena-lms',
    audience: 'aithena-users'
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret-key', {
      issuer: 'aithena-lms',
      audience: 'aithena-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret-key', {
      issuer: 'aithena-lms',
      audience: 'aithena-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens
};

