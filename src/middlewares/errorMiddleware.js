// Middleware untuk menangani error global
module.exports = (err, req, res, next) => {
    // Jika error memiliki status, gunakan status tersebut untuk response
    if (err.status) {
      return res.status(err.status).json({
        status: "error",
        message: err.message,
      });
    }
    
    // Jika error tidak memiliki status, maka default ke Internal Server Error
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  };
  