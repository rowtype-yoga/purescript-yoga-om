class ParallelError extends Error {
  constructor(error) {
    super("Error during parallel execution");
    this.error = error
  }
}

export const newParallelError = (error) => new ParallelError(error)
export const toParallelErrorImpl = (just, nothing, error) => {
  if(error instanceof ParallelError) {
    return just(error)
  }
  return nothing
}
export const getParallelError = (error) => error.error
