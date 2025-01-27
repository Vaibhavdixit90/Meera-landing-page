import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
export const verifyToken = (req: any, secret: string) => {
  // Get the token from the headers using the 'get' method
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  // console.log("🚀 ~ verifyToken ~ authorization:", authHeader);

  if (!authHeader) {
    return { valid: false, message: 'No token provided' };
  }

  const token = authHeader.split(' ')[1]; // Assumes Bearer <token> format

  try {
    const decoded = jwt.verify(token, secret); // Verify token
    return { valid: true, decoded }; // Return the decoded token if valid
  } catch (err) {
    return { valid: false, message: 'Invalid token' };
  }
};
