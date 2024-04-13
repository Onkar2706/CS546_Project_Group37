import userRoutes from './user.js';

const constructor = (app) => {
    app.use('/user', userRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not Found'});
    });
};

export default constructor;