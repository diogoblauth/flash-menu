export class BadRequestError extends Error {
  constructor(message, cause) {
    super(message, { cause })
    this.httpStatus = 400
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Não autorizado', cause) {
    super(message, { cause })
    this.httpStatus = 401
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Sem permissão', cause) {
    super(message, { cause })
    this.httpStatus = 403
  }
}

export class NotFoundError extends Error {
  constructor(message, cause) {
    super(message, { cause })
    this.httpStatus = 404
  }
}

export class ConflictError extends Error {
  constructor(message, cause) {
    super(message, { cause })
    this.httpStatus = 409
  }
}
