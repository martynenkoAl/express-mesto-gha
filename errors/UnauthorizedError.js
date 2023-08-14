class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
