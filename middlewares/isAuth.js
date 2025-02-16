const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const isValid = jwt.verify(token, "secret");
        if (!isValid) {
            return res.json({ success: false, message: "invalid credentials" });
        }

        req.user = isValid;
        next();
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
export default isAuth
