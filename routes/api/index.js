const router = require('express').Router();
const thoughtRoutes = require('./thoughtroutes');
const userRoutes = require('./userroutes');

router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;